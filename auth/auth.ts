import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

// Errores tipados para que el cliente reciba result.code con el mensaje exacto
class InvalidCredentials extends CredentialsSignin {
  code = "Email o contraseña incorrecta"
}
class UserNotFound extends CredentialsSignin {
  code = "Usuario no encontrado"
}
class WrongPassword extends CredentialsSignin {
  code = "Contraseña incorrecta"
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt"},
  pages: {
    signIn: "/admin/login",
    error: "/error",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email"},
        password: { label: "Password", type: "password"},
      },
      async authorize(credentials){
        // Validar datos con Zod
        const parsed = loginSchema.safeParse(credentials);
        if(!parsed.success) throw new InvalidCredentials();
        // Buscar usuario en BD
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user || !user.password) throw new UserNotFound();
        // Verificar contraseña
        const isValid = await bcrypt.compare(parsed.data.password, user?.password || "");
        if(!isValid) throw new WrongPassword();
        // return el usuario
        return { id: user.id, email: user.email, name: user.name }
      }
      })
  ],
  // Función que se ejecutara en cada solicitud de autenticación, se puede usar para agregar datos personalizados al token JWT o a la sesión
  callbacks: {
    async jwt({ token, user}) {
      if (user) token.id = user.id
      return token;
    },
    async session({ session, token}) {
      if (token) session.user.id = token.id as string
      return session;
    }
  }
})

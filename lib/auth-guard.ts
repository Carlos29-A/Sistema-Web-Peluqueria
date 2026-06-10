import { auth } from "@/auth/auth"; 

export async function requireSession() {
    const session = await auth();
    if(!session?.user) {
        return null;
    }
    return session;
}
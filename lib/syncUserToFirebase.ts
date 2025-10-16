import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { UserResource } from "@clerk/types";

export async function syncUserToFirebase(user: UserResource) {
  try {
    if (!user?.id) {
      console.warn("No user data found from Clerk");
      return;
    }

    const userRef = doc(db, "users", user.id);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? "";
      const fullName = user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

      await setDoc(userRef, {
        id: user.id,
        fullName,
        email,
        imageUrl: user.imageUrl ?? "",
        createdAt: new Date().toISOString(),
      });

      console.log("✅ New user added to Firebase:", user.id);
    } else {
      console.log("ℹ️ User already exists in Firebase:", user.id);
    }
  } catch (error) {
    console.error("❌ Error syncing user to Firebase:", error);
  }
}

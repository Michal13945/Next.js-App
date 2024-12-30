import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg flex items-center justify-center"
    >
      <button
        type="submit"
        className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Wyloguj
      </button>
    </form>
  );
}

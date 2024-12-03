import Link from "next/link";
export function NotFound() {
  return (
    <>
      <h1>This page don't exist</h1>
      <Link href="/">
        <button className="btn btn-outline btn-primary">
          Return to home page
        </button>
      </Link>
    </>
  );
}

export default NotFound;

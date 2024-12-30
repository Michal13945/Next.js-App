import Link from "next/link";
export function NotFound() {
  return (
    <>
      <h2>
        <b>You must be logged in</b>
      </h2>
      <Link href="/user/signin">
        <button className="btn btn-outline btn-primary">
          Click here, to sign in
        </button>
      </Link>
    </>
  );
}

export default NotFound;

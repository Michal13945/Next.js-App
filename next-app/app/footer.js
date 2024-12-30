import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-800 footer footer-center text-content p-6 text-white">
      <aside className="flex flex-row items-right">
        <Image
          src="/WSEI.png"
          alt="WSEI logo"
          className="w-24 mb-2"
          width={96}
          height={96}
        />
        <div className="ml-4">
          <p className="font-semibold text-sm">Student WSEI</p>
          <p className="text-xs">michal.sroka@microsoft.wsei.edu.pl</p>
        </div>
      </aside>
    </footer>
  );
}

export default Footer;

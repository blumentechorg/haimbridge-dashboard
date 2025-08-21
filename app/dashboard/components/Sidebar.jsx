// // "use client";
// // import Link from "next/link";
// // export default function Sidebar() {
// //   return (
// //     <aside className="w-64 bg-white border-r min-h-screen p-6">
// //       <div className="mb-8">
// //         <div className="text-2xl font-bold text-purple-600">Haimbridge</div>
// //       </div>
// //       <nav className="space-y-2 text-sm">
// //         <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
// //           Listing
// //         </Link>
// //         <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
// //           Metrics
// //         </Link>
// //         <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
// //           Invoice
// //         </Link>
// //         <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
// //           Settings
// //         </Link>
// //       </nav>
// //     </aside>
// //   );
// // }

// // // components/Sidebar.jsx
// // "use client";

// // import { useEffect, useState } from "react";
// // import Link from "next/link";
// // import { usePathname, useRouter } from "next/navigation";
// // import { clearToken } from "@/lib/auth"; // adjust path if your lib folder is in a different location

// // export default function Sidebar() {
// //   const pathname = usePathname();
// //   const router = useRouter();

// //   // collapse state (icons-only), persisted
// //   const [collapsed, setCollapsed] = useState(false);
// //   // mobile drawer open
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   useEffect(() => {
// //     try {
// //       const stored = localStorage.getItem("hb_sidebar_collapsed");
// //       setCollapsed(stored === "1");
// //     } catch (e) {
// //       /* ignore */
// //     }
// //   }, []);

// //   useEffect(() => {
// //     try {
// //       localStorage.setItem("hb_sidebar_collapsed", collapsed ? "1" : "0");
// //     } catch (e) {
// //       /* ignore */
// //     }
// //   }, [collapsed]);

// //   // menu definition (name, path, icon component)
// //   const menu = [
// //     { name: "Dashboard", href: "/dashboard", Icon: IconHome },
// //     { name: "Metrics", href: "/dashboard/metrics", Icon: IconChart },
// //     { name: "Invoice", href: "/dashboard/invoice", Icon: IconInvoice },
// //     { name: "Settings", href: "/dashboard/settings", Icon: IconSettings },
// //   ];

// //   function handleLogout() {
// //     clearToken();
// //     router.push("/auth/login");
// //   }

// //   // helper to check active route
// //   const isActive = (href) => {
// //     if (!pathname) return false;
// //     if (href === "/") return pathname === "/";
// //     return pathname === href || pathname.startsWith(href + "/");
// //   };

// //   return (
// //     <>
// //       {/* mobile overlay */}
// //       <div
// //         className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${
// //           mobileOpen
// //             ? "opacity-100 pointer-events-auto"
// //             : "opacity-0 pointer-events-none"
// //         }`}
// //         onClick={() => setMobileOpen(false)}
// //         aria-hidden={!mobileOpen}
// //       />

// //       <aside
// //         aria-label="Main sidebar"
// //         className={`fixed z-40 top-0 left-0 h-full bg-white border-r shadow-sm flex flex-col justify-between transition-all duration-300
// //           ${collapsed ? "w-20" : "w-64"}
// //           ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
// //         `}
// //       >
// //         <div>
// //           {/* header with logo + collapse toggle */}
// //           <div className="flex items-center justify-between px-4 py-4">
// //             <div className="flex items-center gap-3">
// //               <div className="bg-purple-100 text-purple-700 rounded-md p-2 flex items-center justify-center">
// //                 {/* small logo (SVG) */}
// //                 <svg
// //                   width="20"
// //                   height="20"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   aria-hidden
// //                 >
// //                   <path
// //                     d="M3 12h18"
// //                     stroke="currentColor"
// //                     strokeWidth="1.5"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                   />
// //                   <path
// //                     d="M7 6h10"
// //                     stroke="currentColor"
// //                     strokeWidth="1.5"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                   />
// //                 </svg>
// //               </div>
// //               {!collapsed && (
// //                 <div className="text-lg font-semibold text-purple-600">
// //                   Haimbridge
// //                 </div>
// //               )}
// //             </div>

// //             {/* collapse toggle on md+; mobile close (x) shown via CSS in mobile drawer overlay */}
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => {
// //                   // if on mobile, toggles drawer; if on desktop, collapse
// //                   if (
// //                     typeof window !== "undefined" &&
// //                     window.innerWidth < 768
// //                   ) {
// //                     setMobileOpen((v) => !v);
// //                   } else {
// //                     setCollapsed((c) => !c);
// //                   }
// //                 }}
// //                 className="p-2 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-purple-200"
// //                 aria-pressed={collapsed}
// //                 aria-label="Toggle sidebar"
// //               >
// //                 {/* icon rotates for collapse */}
// //                 <svg
// //                   className={`w-4 h-4 transform transition-transform ${
// //                     collapsed ? "rotate-180" : "rotate-0"
// //                   }`}
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   aria-hidden
// //                 >
// //                   <path
// //                     d="M9 18l6-6-6-6"
// //                     stroke="currentColor"
// //                     strokeWidth="2"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                   />
// //                 </svg>
// //               </button>
// //             </div>
// //           </div>

// //           {/* menu */}
// //           <nav className="mt-4 px-2 space-y-1" aria-label="Main">
// //             {menu.map(({ name, href, Icon }) => {
// //               const active = isActive(href);
// //               return (
// //                 <Link
// //                   key={name}
// //                   href={href}
// //                   className={[
// //                     "flex items-center gap-3 py-2 px-3 rounded-lg mx-2 transition-colors",
// //                     active
// //                       ? "bg-purple-50 text-purple-700 font-medium"
// //                       : "text-gray-700 hover:bg-gray-50",
// //                     collapsed ? "justify-center" : "justify-start",
// //                   ].join(" ")}
// //                   title={name}
// //                 >
// //                   <span className="w-6 h-6 flex items-center justify-center">
// //                     <Icon active={active} />
// //                   </span>
// //                   {!collapsed && <span className="truncate">{name}</span>}
// //                 </Link>
// //               );
// //             })}
// //           </nav>
// //         </div>

// //         {/* bottom area with account + logout */}
// //         <div className="px-3 pb-6">
// //           <div
// //             className={`mx-2 p-3 rounded-md ${
// //               collapsed
// //                 ? "justify-center flex"
// //                 : "hover:bg-gray-50 flex items-center gap-3"
// //             }`}
// //           >
// //             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
// //               <svg
// //                 className="w-6 h-6 text-gray-700"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 aria-hidden
// //               >
// //                 <path
// //                   d="M12 12a4 4 0 100-8 4 4 0 000 8z"
// //                   stroke="currentColor"
// //                   strokeWidth="1.2"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                 />
// //                 <path
// //                   d="M6 20a6 6 0 0112 0"
// //                   stroke="currentColor"
// //                   strokeWidth="1.2"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                 />
// //               </svg>
// //             </div>

// //             {!collapsed && (
// //               <div className="flex-1 text-sm">
// //                 <div className="text-gray-600">Welcome back,</div>
// //                 <div className="font-medium text-gray-900">Building Owner</div>
// //                 <div className="text-xs text-gray-500">owner@example.com</div>
// //               </div>
// //             )}
// //           </div>

// //           <div className={`mt-3 ${collapsed ? "flex justify-center" : ""}`}>
// //             <button
// //               onClick={handleLogout}
// //               className={[
// //                 "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors",
// //                 "bg-white border hover:bg-purple-50",
// //                 collapsed ? "justify-center" : "justify-start",
// //               ].join(" ")}
// //             >
// //               <span className="w-6 h-6 flex items-center justify-center text-gray-700">
// //                 <svg
// //                   className="w-5 h-5"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   aria-hidden
// //                 >
// //                   <path
// //                     d="M16 17l5-5-5-5"
// //                     stroke="currentColor"
// //                     strokeWidth="1.5"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                   />
// //                   <path
// //                     d="M21 12H9"
// //                     stroke="currentColor"
// //                     strokeWidth="1.5"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                   />
// //                   <path
// //                     d="M13 19H7a2 2 0 01-2-2V7a2 2 0 012-2h6"
// //                     stroke="currentColor"
// //                     strokeWidth="1.5"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                   />
// //                 </svg>
// //               </span>

// //               {!collapsed && (
// //                 <span className="text-sm text-gray-900">Logout</span>
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </aside>
// //     </>
// //   );
// // }

// // /* ---------- Inline Icon components ---------- */

// // function IconHome({ active }) {
// //   return (
// //     <svg
// //       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       aria-hidden
// //     >
// //       <path
// //         d="M3 11.5L12 4l9 7.5"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //       <path
// //         d="M5 11.5v6.5a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-6.5"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   );
// // }
// // function IconChart({ active }) {
// //   return (
// //     <svg
// //       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       aria-hidden
// //     >
// //       <path
// //         d="M12 20V10"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //       <path
// //         d="M18 20V4"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //       <path
// //         d="M6 20v-6"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   );
// // }
// // function IconInvoice({ active }) {
// //   return (
// //     <svg
// //       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       aria-hidden
// //     >
// //       <rect
// //         x="3"
// //         y="3"
// //         width="18"
// //         height="18"
// //         rx="2"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //       <path
// //         d="M7 7h10M7 12h10M7 17h7"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   );
// // }
// // function IconSettings({ active }) {
// //   return (
// //     <svg
// //       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       aria-hidden
// //     >
// //       <path
// //         d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"
// //         stroke="currentColor"
// //         strokeWidth="1.2"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //       <path
// //         d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82A1.65 1.65 0 003 13.6H3a2 2 0 010-4h.09a1.65 1.65 0 00.33-1.82L3.36 7.88a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09c.2.7.7 1.2 1.4 1.4h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.7.2 1.2.7 1.4 1.4V11a2 2 0 010 4h-.09a1.65 1.65 0 00-.33 1.82z"
// //         stroke="currentColor"
// //         strokeWidth="1.2"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   );
// // }

// "use client";

// import { useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { clearToken } from "@/lib/auth";

// export default function Sidebar({
//   collapsed,
//   setCollapsed,
//   mobileOpen,
//   setMobileOpen,
// }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const menu = [
//     { name: "Dashboard", href: "/dashboard", Icon: IconHome },
//     { name: "Metrics", href: "/dashboard/metrics", Icon: IconChart },
//     { name: "Invoice", href: "/dashboard/invoice", Icon: IconInvoice },
//     { name: "Settings", href: "/dashboard/settings", Icon: IconSettings },
//   ];

//   useEffect(() => {
//     // close mobile drawer after route change
//     setMobileOpen && setMobileOpen(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname]);

//   const isActive = (href) =>
//     pathname && (pathname === href || pathname.startsWith(href + "/"));

//   function handleLogout() {
//     clearToken();
//     router.push("/auth/login");
//   }

//   return (
//     <>
//       {/* Mobile overlay */}
//       <div
//         className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
//           mobileOpen
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setMobileOpen(false)}
//         aria-hidden={!mobileOpen}
//       />

//       {/* Sidebar:
//           - mobile: fixed drawer (translate in/out)
//           - md+: static in flow (so it pushes content) with width controlled by collapsed state
//       */}
//       <aside
//         aria-label="Main sidebar"
//         className={[
//           "flex flex-col justify-between bg-white border-r shadow-sm h-full transition-all duration-300",
//           // width
//           collapsed ? "w-20" : "w-64",
//           // positioning: fixed drawer on small screens, static in flow on md+
//           mobileOpen
//             ? "fixed z-50 top-0 left-0 h-full transform translate-x-0"
//             : "fixed -translate-x-full md:translate-x-0 md:static",
//         ].join(" ")}
//         style={{ minHeight: "100vh" }}
//       >
//         <div>
//           {/* header */}
//           <div className="flex items-center justify-between px-4 py-4">
//             <div className="flex items-center gap-3">
//               <div className="bg-purple-100 text-purple-700 rounded-md p-2 flex items-center justify-center">
//                 <svg
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   aria-hidden
//                 >
//                   <path
//                     d="M3 12h18"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M7 6h10"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </div>
//               {!collapsed && (
//                 <div className="text-lg font-semibold text-purple-600">
//                   Haimbridge
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => {
//                   if (
//                     typeof window !== "undefined" &&
//                     window.innerWidth < 768
//                   ) {
//                     setMobileOpen((v) => !v);
//                   } else {
//                     setCollapsed((c) => !c);
//                   }
//                 }}
//                 className="p-2 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-purple-200"
//                 aria-pressed={collapsed}
//                 aria-label="Toggle sidebar"
//               >
//                 <svg
//                   className={`w-4 h-4 transform transition-transform ${
//                     collapsed ? "rotate-180" : "rotate-0"
//                   }`}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   aria-hidden
//                 >
//                   <path
//                     d="M9 18l6-6-6-6"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* menu */}
//           <nav className="mt-4 px-2 space-y-1" aria-label="Main">
//             {menu.map(({ name, href, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <Link
//                   key={name}
//                   href={href}
//                   className={[
//                     "flex items-center gap-3 py-2 px-3 rounded-lg mx-2 transition-colors",
//                     active
//                       ? "bg-purple-50  font-medium"
//                       : "text-gray-700 hover:bg-gray-50",
//                     collapsed ? "justify-center" : "justify-start",
//                   ].join(" ")}
//                   title={name}
//                 >
//                   <span className="w-6 h-6 flex items-center justify-center">
//                     <Icon active={active} />
//                   </span>
//                   {!collapsed && <span className="truncate">{name}</span>}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* bottom area */}
//         <div className="px-3 pb-6">
//           <div
//             className={`mx-2 p-3 rounded-md ${
//               collapsed
//                 ? "justify-center flex"
//                 : "flex items-center gap-3 hover:bg-gray-50"
//             }`}
//           >
//             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
//               <svg
//                 className="w-6 h-6 text-gray-700"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 aria-hidden
//               >
//                 <path
//                   d="M12 12a4 4 0 100-8 4 4 0 000 8z"
//                   stroke="currentColor"
//                   strokeWidth="1.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M6 20a6 6 0 0112 0"
//                   stroke="currentColor"
//                   strokeWidth="1.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>

//             {!collapsed && (
//               <div className="flex-1 text-sm">
//                 <div className="text-gray-600">Welcome back,</div>
//                 <div className="font-medium text-gray-900">Building Owner</div>
//                 <div className="text-xs text-gray-500">owner@example.com</div>
//               </div>
//             )}
//           </div>

//           <div className={`mt-3 ${collapsed ? "flex justify-center" : ""}`}>
//             <button
//               onClick={handleLogout}
//               className={[
//                 "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors",
//                 "bg-white border hover:bg-purple-50",
//                 collapsed ? "justify-center" : "justify-start",
//               ].join(" ")}
//             >
//               <span className="w-6 h-6 flex items-center justify-center text-gray-700">
//                 <svg
//                   className="w-5 h-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   aria-hidden
//                 >
//                   <path
//                     d="M16 17l5-5-5-5"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M21 12H9"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M13 19H7a2 2 0 01-2-2V7a2 2 0 012-2h6"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </span>

//               {!collapsed && (
//                 <span className="text-sm text-gray-900">Logout</span>
//               )}
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// /* ---------- Inline Icon components ---------- */

// function IconHome({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <path
//         d="M3 11.5L12 4l9 7.5"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M5 11.5v6.5a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-6.5"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function IconChart({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <path
//         d="M12 20V10"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M18 20V4"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M6 20v-6"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function IconInvoice({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <rect
//         x="3"
//         y="3"
//         width="18"
//         height="18"
//         rx="2"
//         stroke="currentColor"
//         strokeWidth="1.5"
//       />
//       <path
//         d="M7 7h10M7 12h10M7 17h7"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function IconSettings({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <path
//         d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"
//         stroke="currentColor"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82A1.65 1.65 0 003 13.6H3a2 2 0 010-4h.09a1.65 1.65 0 00.33-1.82L3.36 7.88a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09c.2.7.7 1.2 1.4 1.4h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.7.2 1.2.7 1.4 1.4V11a2 2 0 010 4h-.09a1.65 1.65 0 00-.33 1.82z"
//         stroke="currentColor"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// // components/Sidebar.jsx
// "use client";

// import { useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { clearToken } from "@/lib/auth";

// export default function Sidebar({
//   collapsed,
//   setCollapsed,
//   mobileOpen,
//   setMobileOpen,
// }) {
//   const pathname = usePathname() || "/";
//   const router = useRouter();

//   const menu = [
//     { name: "Dashboard", href: "/dashboard", Icon: IconHome },
//     { name: "Metrics", href: "/dashboard/metrics", Icon: IconChart },
//     { name: "Invoice", href: "/dashboard/invoice", Icon: IconInvoice },
//     { name: "Settings", href: "/dashboard/settings", Icon: IconSettings },
//   ];

//   useEffect(() => {
//     setMobileOpen && setMobileOpen(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname]);

//   function handleLogout() {
//     clearToken();
//     router.push("/auth/login");
//   }

//   // Determine the single best (longest) matching href for the current pathname
//   const activeHref = (() => {
//     // normalize: remove trailing slashes from pathname for matching
//     const normalizedPath = pathname.replace(/\/+$/, "") || "/";
//     let best = null;
//     for (const item of menu) {
//       const h = (item.href || "").replace(/\/+$/, "") || "/";
//       if (h === normalizedPath) {
//         // exact match wins immediately
//         best = h;
//         break;
//       }
//       // check prefix match (child route)
//       if (h !== "/" && normalizedPath.startsWith(h + "/")) {
//         if (!best || h.length > best.length) best = h;
//       }
//     }
//     return best;
//   })();

//   const isActive = (href) => {
//     const h = (href || "").replace(/\/+$/, "") || "/";
//     return (
//       activeHref === h ||
//       (activeHref === null && (pathname.replace(/\/+$/, "") || "/") === h)
//     );
//   };

//   return (
//     <>
//       {/* mobile overlay */}
//       <div
//         className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
//           mobileOpen
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setMobileOpen(false)}
//         aria-hidden={!mobileOpen}
//       />

//       <aside
//         aria-label="Main sidebar"
//         className={[
//           "flex flex-col justify-between bg-white border-r shadow-sm h-full transition-all duration-300",
//           collapsed ? "w-20" : "w-64",
//           mobileOpen
//             ? "fixed z-50 top-0 left-0 h-full transform translate-x-0"
//             : "fixed -translate-x-full md:translate-x-0 md:static",
//         ].join(" ")}
//         style={{ minHeight: "100vh" }}
//       >
//         <div>
//           <div className="flex items-center justify-between px-4 py-4">
//             <div className="flex items-center gap-3">
//               <div className="bg-purple-100 text-purple-700 rounded-md p-2 flex items-center justify-center">
//                 <svg
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   aria-hidden
//                 >
//                   <path
//                     d="M3 12h18"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M7 6h10"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </div>
//               {!collapsed && (
//                 <div className="text-lg font-semibold text-purple-600">
//                   Haimbridge
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => {
//                   if (
//                     typeof window !== "undefined" &&
//                     window.innerWidth < 768
//                   ) {
//                     setMobileOpen((v) => !v);
//                   } else {
//                     setCollapsed((c) => !c);
//                   }
//                 }}
//                 className="p-2 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-purple-200"
//                 aria-pressed={collapsed}
//                 aria-label="Toggle sidebar"
//               >
//                 <svg
//                   className={`w-4 h-4 transform transition-transform ${
//                     collapsed ? "rotate-180" : "rotate-0"
//                   }`}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   aria-hidden
//                 >
//                   <path
//                     d="M9 18l6-6-6-6"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <nav className="mt-4 px-2 space-y-1" aria-label="Main">
//             {menu.map(({ name, href, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <Link
//                   key={name}
//                   href={href}
//                   className={[
//                     "flex items-center gap-3 py-2 px-3 rounded-lg mx-2 transition-colors",
//                     active
//                       ? "bg-purple-50 text-purple-700 font-medium"
//                       : "text-gray-700 hover:bg-gray-50",
//                     collapsed ? "justify-center" : "justify-start",
//                   ].join(" ")}
//                   title={name}
//                 >
//                   <span className="w-6 h-6 flex items-center justify-center">
//                     <Icon active={active} />
//                   </span>
//                   {!collapsed && <span className="truncate">{name}</span>}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="px-3 pb-6">
//           <div
//             className={`mx-2 p-3 rounded-md ${
//               collapsed
//                 ? "justify-center flex"
//                 : "flex items-center gap-3 hover:bg-gray-50"
//             }`}
//           >
//             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
//               <svg
//                 className="w-6 h-6 text-gray-700"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 aria-hidden
//               >
//                 <path
//                   d="M12 12a4 4 0 100-8 4 4 0 000 8z"
//                   stroke="currentColor"
//                   strokeWidth="1.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M6 20a6 6 0 0112 0"
//                   stroke="currentColor"
//                   strokeWidth="1.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>

//             {!collapsed && (
//               <div className="flex-1 text-sm">
//                 <div className="text-gray-600">Welcome back,</div>
//                 <div className="font-medium text-gray-900">Building Owner</div>
//                 <div className="text-xs text-gray-500">owner@example.com</div>
//               </div>
//             )}
//           </div>

//           <div className={`mt-3 ${collapsed ? "flex justify-center" : ""}`}>
//             <button
//               onClick={handleLogout}
//               className={[
//                 "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors",
//                 "bg-white border hover:bg-purple-50",
//                 collapsed ? "justify-center" : "justify-start",
//               ].join(" ")}
//             >
//               <span className="w-6 h-6 flex items-center justify-center text-gray-700">
//                 <svg
//                   className="w-5 h-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   aria-hidden
//                 >
//                   <path
//                     d="M16 17l5-5-5-5"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M21 12H9"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M13 19H7a2 2 0 01-2-2V7a2 2 0 012-2h6"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </span>

//               {!collapsed && (
//                 <span className="text-sm text-gray-900">Logout</span>
//               )}
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// /* ---------- Inline Icon components ---------- */

// function IconHome({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <path
//         d="M3 11.5L12 4l9 7.5"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M5 11.5v6.5a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-6.5"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function IconChart({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <path
//         d="M12 20V10"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M18 20V4"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M6 20v-6"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function IconInvoice({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <rect
//         x="3"
//         y="3"
//         width="18"
//         height="18"
//         rx="2"
//         stroke="currentColor"
//         strokeWidth="1.5"
//       />
//       <path
//         d="M7 7h10M7 12h10M7 17h7"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function IconSettings({ active }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <path
//         d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"
//         stroke="currentColor"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82A1.65 1.65 0 003 13.6H3a2 2 0 010-4h.09a1.65 1.65 0 00.33-1.82L3.36 7.88a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09c.2.7.7 1.2 1.4 1.4h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.7.2 1.2.7 1.4 1.4V11a2 2 0 010 4h-.09a1.65 1.65 0 00-.33 1.82z"
//         stroke="currentColor"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// components/Sidebar.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function Sidebar(props) {
  const {
    // optional parent-controlled props; if not provided, component falls back to internal state
    collapsed: collapsedProp,
    setCollapsed: setCollapsedProp,
    mobileOpen: mobileOpenProp,
    setMobileOpen: setMobileOpenProp,
  } = props || {};

  const router = useRouter();
  const pathname = usePathname() || "/";

  // local fallback state if parent doesn't provide control
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  // prefer controlled values if provided
  const collapsed =
    typeof collapsedProp === "boolean" ? collapsedProp : internalCollapsed;
  const mobileOpen =
    typeof mobileOpenProp === "boolean" ? mobileOpenProp : internalMobileOpen;

  // setter wrappers: call parent setter if provided, otherwise update internal
  const setCollapsed = (v) => {
    if (typeof setCollapsedProp === "function") setCollapsedProp(v);
    else setInternalCollapsed(v);
    try {
      localStorage.setItem("hb_sidebar_collapsed", v ? "1" : "0");
    } catch {}
  };
  const setMobileOpen = (v) => {
    if (typeof setMobileOpenProp === "function") setMobileOpenProp(v);
    else setInternalMobileOpen(v);
  };

  useEffect(() => {
    // initialize internalCollapsed from localStorage only for internal mode
    if (typeof collapsedProp === "undefined") {
      try {
        const stored = localStorage.getItem("hb_sidebar_collapsed");
        setInternalCollapsed(stored === "1");
      } catch (e) {
        /* ignore */
      }
    }
    // keep mobile drawer closed when path changes
    // (if parent controls mobileOpen, parent likely manages it; still safe to close internal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // automatically close mobile drawer when path changes (parent or internal)
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const menu = useMemo(
    () => [
      { name: "Dashboard", href: "/dashboard", Icon: IconHome },
      { name: "Metrics", href: "/dashboard/metrics", Icon: IconChart },
      { name: "Invoice", href: "/dashboard/invoice", Icon: IconInvoice },
      { name: "Settings", href: "/dashboard/settings", Icon: IconSettings },
    ],
    []
  );

  const activeHref = useMemo(() => {
    const normalizedPath = (pathname || "/").replace(/\/+$/, "") || "/";
    let best = null;
    for (const item of menu) {
      const h = (item.href || "").replace(/\/+$/, "") || "/";
      if (h === normalizedPath) {
        best = h;
        break;
      }
      if (h !== "/" && normalizedPath.startsWith(h + "/")) {
        if (!best || h.length > best.length) best = h;
      }
    }
    return best;
  }, [menu, pathname]);

  const isActive = (href) => {
    const h = (href || "").replace(/\/+$/, "") || "/";
    return (
      activeHref === h ||
      (activeHref === null && (pathname.replace(/\/+$/, "") || "/") === h)
    );
  };

  function toggleCollapse() {
    setCollapsed(!collapsed);
  }
  function toggleMobile() {
    setMobileOpen(!mobileOpen);
  }

  function handleLogout() {
    clearToken();
    router.push("/auth/login");
  }

  return (
    <>
      {/* mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      {/* Sidebar:
          - mobile: fixed drawer (translate in/out)
          - md+: static in flow so it pushes content (we keep md:static in layout)
      */}
      <aside
        aria-label="Main sidebar"
        className={[
          "flex flex-col justify-between bg-white border-r shadow-sm h-full transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen
            ? "fixed z-50 top-0 left-0 h-full transform translate-x-0"
            : "fixed -translate-x-full md:translate-x-0 md:static",
        ].join(" ")}
        style={{ minHeight: "100vh" }}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 rounded-md p-2 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 12h18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 6h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {!collapsed && (
                <div className="text-lg font-semibold text-purple-600">
                  Haimbridge
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // mobile toggles drawer; desktop toggles collapsed
                  if (typeof window !== "undefined" && window.innerWidth < 768)
                    toggleMobile();
                  else toggleCollapse();
                }}
                className="p-2 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-purple-200"
                aria-pressed={collapsed}
                aria-label="Toggle sidebar"
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    collapsed ? "rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <nav className="mt-4 px-2 space-y-1" aria-label="Main">
            {menu.map(({ name, href, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={name}
                  href={href}
                  className={[
                    "flex items-center gap-3 py-2 px-3 rounded-lg mx-2 transition-colors",
                    active
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50",
                    collapsed ? "justify-center" : "justify-start",
                  ].join(" ")}
                  title={name}
                >
                  <span className="w-6 h-6 flex items-center justify-center">
                    <Icon active={active} />
                  </span>
                  {!collapsed && <span className="truncate">{name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3 pb-6">
          <div
            className={`mx-2 p-3 rounded-md ${
              collapsed
                ? "justify-center flex"
                : "flex items-center gap-3 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 20a6 6 0 0112 0"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {!collapsed && (
              <div className="flex-1 text-sm">
                <div className="text-gray-600">Welcome back,</div>
                <div className="font-medium text-gray-900">Building Owner</div>
                <div className="text-xs text-gray-500">owner@example.com</div>
              </div>
            )}
          </div>

          <div className={`mt-3 ${collapsed ? "flex justify-center" : ""}`}>
            <button
              onClick={handleLogout}
              className={[
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors",
                "bg-white border hover:bg-purple-50",
                collapsed ? "justify-center" : "justify-start",
              ].join(" ")}
            >
              <span className="w-6 h-6 flex items-center justify-center text-gray-700">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M16 17l5-5-5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 19H7a2 2 0 01-2-2V7a2 2 0 012-2h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              {!collapsed && (
                <span className="text-sm text-gray-900">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------- Inline Icon components ---------- */

function IconHome({ active }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 11.5L12 4l9 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 11.5v6.5a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconChart({ active }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 20V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 20V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 20v-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconInvoice({ active }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 7h10M7 12h10M7 17h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconSettings({ active }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82A1.65 1.65 0 003 13.6H3a2 2 0 010-4h.09a1.65 1.65 0 00.33-1.82L3.36 7.88a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09c.2.7.7 1.2 1.4 1.4h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.7.2 1.2.7 1.4 1.4V11a2 2 0 010 4h-.09a1.65 1.65 0 00-.33 1.82z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

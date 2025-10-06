"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import Image from "next/image";
import { useTranslations } from 'next-intl';
export default function Navbar() {
    const t = useTranslations('nav');
    const { locale } = (useParams() as { locale?: string }) || {};
    const prefix = locale ? `/${locale}` : "";
    const [open, setOpen] = useState(false);

    // const navItems = [
    //     { label: "Home", href: "/" },
    //     { label: "About Us", href: "/about" },
    //     { label: "Submissions", href: "/submissions" },
    //     { label: "Books", href: "/books" },
    //     { label: "Journals", href: "/journals" },
    //     { label: "Authors", href: "/authors" },
    //     { label: "Contact Us", href: "/contact" }
    // ];

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 w-full">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link href={`/${locale}`}>{t('home')}</Link></li>
                        <li><Link href={`/${locale}/about`}>{t('about')}</Link></li>
                        <li>
                            <>{t('submissions')}</>
                            <ul className="p-2">
                                <li><Link href={`/${locale}/submissions/manuscriptGuidelines`}>{t('manuscriptGuidelines')}</Link></li>
                                <li><Link href={`/${locale}/submissions/policies`}>{t('policies')}</Link></li>
                            </ul>
                        </li>
                        <li>
                            <>{t('books')}</>
                            <ul className="p-2">
                                <li><Link href={`/${locale}/books/english`}>{t('english')}</Link></li>
                                <li><Link href={`/${locale}/books/tamil`}>{t('tamil')}</Link></li>
                            </ul>
                        </li>
                        <li>
                            <>{t('journals')}</>
                            <ul className="p-2">
                                <li><Link href={`/${locale}/journals/english`}>{t('english')}</Link></li>
                                <li><Link href={`/${locale}/journals/tamil`}>{t('tamil')}</Link></li>
                            </ul>
                        </li>
                        <li><Link href={`/${locale}/authors`}>{t('authors')}</Link></li>
                        <li><Link href={`/${locale}/contact`}>{t('contact')}</Link></li>
                    </ul>
                </div>
                <a href={`/${locale}`}><Image src="/Logo.png" alt="Logo" width={250} height={150} /></a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href={`/${locale}`}>{t('home')}</Link></li>
                    <li><Link href={`/${locale}/about`}>{t('about')}</Link></li>
                    <li>
                        <details>
                            <summary>{t('submissions')}</summary>
                            <ul className="p-2">
                                <li><Link href={`/${locale}/submissions/manuscriptGuidelines`}>{t('manuscriptGuidelines')}</Link></li>
                                <li><Link href={`/${locale}/submissions/policies`}>{t('policies')}</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>{t('books')}</summary>
                            <ul className="p-2">
                                <li><Link href={`/${locale}/books/english`}>{t('english')}</Link></li>
                                <li><Link href={`/${locale}/books/tamil`}>{t('tamil')}</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>{t('journals')}</summary>
                            <ul className="p-2">
                                <li><Link href={`/${locale}/journals/english`}>{t('english')}</Link></li>
                                <li><Link href={`/${locale}/journals/tamil`}>{t('tamil')}</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link href={`/${locale}/authors`}>{t('authors')}</Link></li>
                    <li><Link href={`/${locale}/contact`}>{t('contact')}</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <LocaleSwitcher />
            </div>
        </div>

    )
};
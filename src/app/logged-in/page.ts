'use client';

import { redirect, RedirectType } from 'next/navigation';
import { useEffect } from 'react';

export default function LoggedIn() {
    useEffect(() => {
        const path = window.localStorage.getItem('redirect-path');

        if (path) {
            redirect(path);
        }

        redirect('/', RedirectType.replace);
    }, []);
}

import { AppStatusProvider } from "@/lib/app-status";

export default function RootLayout({ children, }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body><AppStatusProvider>{children}</AppStatusProvider></body>
        </html>
    )
}

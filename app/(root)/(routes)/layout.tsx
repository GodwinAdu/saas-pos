
import Footer from "@/components/commons/Footer";
import Navbar from "@/components/commons/Navbar";

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
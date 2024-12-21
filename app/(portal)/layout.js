import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Layout({ children }) {
    
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64 bg-slate-100">
                <Header/>
                {children}
            </main>
        </div>
    )
}
import FormCreateGroup from "@/components/groups/FormCreateGroup"
import Groups from "@/components/groups/Groups"
import { ReactNode } from "react"

export default function GroupsLayout({children} : {children: ReactNode}) {
    return (
        <main className="container groupPage">
            <section className="left-side">
                <Groups />
            </section>
            <section className="right-side">
               <FormCreateGroup />
               {children}
            </section>
        </main>
    )
}
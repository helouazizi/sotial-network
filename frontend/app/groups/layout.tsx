import FormCreateGroup from "@/components/groups/FormCreateGroup"
import Groups from "@/components/groups/Groups"
import { GroupsProvider } from "@/context/GroupsContext"
import { ReactNode } from "react"

export default function GroupsLayout({ children }: { children: ReactNode }) {
    return (
        <GroupsProvider >
            <main className="container groupPage">
                <section className="left-side">
                    <Groups />
                </section>
                <section className="right-side">
                    <FormCreateGroup />
                    {children}
                </section>
            </main>
        </GroupsProvider>
    )
}
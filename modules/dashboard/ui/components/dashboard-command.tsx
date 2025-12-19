import { useRouter } from "next/navigation";
import { CommandGroup, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "@/components/ui/command"

import { Dispatch, SetStateAction, useState } from "react";

import { CommandEmpty } from "cmdk";
interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen}: Props) => {
    const router = useRouter();
    const [search, setSearch] = useState("");


    return (
        <CommandResponsiveDialog
            open={open} 
            onOpenChange={setOpen} 
            shouldFilter={false}
        >
            <CommandInput
                placeholder="Find a meeting or agent..."
                value={search}
                onValueChange={(value) => setSearch(value)}
            />
            <CommandList>
                <CommandGroup heading="Meetings">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No meetings found
                        </span>
                    </CommandEmpty>
                        {/* <CommandItem 
                            onSelect={() => {router.push(`/meetings/${meeting.id}`);
                            setOpen(false);
                            }}
                            key={meeting.id}
                        >
                            {meeting.name}
                        </CommandItem> */}
                </CommandGroup>
                <CommandGroup heading="agents">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No agents found
                        </span>
                    </CommandEmpty>
                    {/* {agents.data?.items.map((agent) => (
                        <CommandItem 
                            onSelect={() => {router.push(`/agents/${agent.id}`)
                            setOpen(false);
                            }}
                            key={agent.id}
                        >
                            {agent.name}
                        </CommandItem>
                    ))} */}
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    )
}
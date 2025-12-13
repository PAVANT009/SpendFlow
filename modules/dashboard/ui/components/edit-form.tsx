import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import MyForm from "./my-form"
import { Subscription } from "@/types/Subscription";

export function EditForm({ open, onOpenChange,data,onSubmit }: {open?: boolean; onOpenChange?: (open: boolean) => void; data?: Subscription; onSubmit: (values: Subscription) => Promise<void>}) {
    console.log(open, onOpenChange, data);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger> */}
      <SheetContent side="bottom" className="w-[800px] h-[95vh] max-h-screen rounded-md mx-auto px-2.5 overflow-auto border-0">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {/* <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div> */}
        <MyForm initialValues={data}  onSubmit={onSubmit}/>
        <SheetFooter>
          <Button 
            type="submit"
            form="subscription-form"
          >Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

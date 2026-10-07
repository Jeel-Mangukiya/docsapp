import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { ExternalLinkIcon, MoreVertical, TrashIcon,FilePenIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";


interface DocumentMenuProps {
    documentId: Id<"documents">;
    title: string;
    onNewTab:(id:Id<"documents">) => void
}

export const DocumetMenu = ({documentId,title,onNewTab}:DocumentMenuProps) =>{
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                >   
                    <MoreVertical className="size-4"/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40">
                <RenameDialog documentId={documentId} initialTitle={title}>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()
                        }
                        onClick={(e) => e.stopPropagation()}    
                     >
                        <FilePenIcon className="mr-2 h-4 w-4" />
                        Rename
                    </DropdownMenuItem>
                </RenameDialog>
                <RemoveDialog documentId={documentId}>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()
                        }
                        onClick={(e) => e.stopPropagation()}    
                     >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Remove
                    </DropdownMenuItem>
                </RemoveDialog>
                <DropdownMenuItem onClick={()=>onNewTab(documentId)}>
                    <ExternalLinkIcon className="mr-2 h-4 w-4" />
                    Open in new tab
                </DropdownMenuItem>
            </DropdownMenuContent>
                
        </DropdownMenu>
        
    );
}   
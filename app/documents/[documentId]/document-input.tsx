import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDebounce } from "@/hooks/use-debounce";
import { useStatus } from "@liveblocks/react";
import { useMutation } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { useRef, useState } from "react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { toast } from "sonner";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {

const  status = useStatus(); 
  const [value, setValue] = useState(title);
  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const mutate = useMutation(api.documents.UpdateById);

  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;

    setIsPending(true);
    mutate({ id, title: newValue })
        .then(() => toast.success("Document updated"))
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setIsPending(false));
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedUpdate(newValue);
        };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      setIsError(true);
      return;
    }

    try {
      setIsPending(true);
      await mutate({
        id,
        title: value,
      });
       toast.success("Document updated successfully");
      setIsEditing(false);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      toast.error("Failed to update document");
    } finally {
      setIsPending(false);
    }
  };

  const showLoader = isPending || status === "connecting" || status === "reconnecting";

  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2 relative">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch] overflow-hidden">
        <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || " "}
        </span>

        <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={()=>setIsEditing(false)}
            className="absolute inset-0 w-full text-lg text-black px-1.5 bg-transparent truncate outline-none border border-transparent focus:border-blue-500 rounded-sm"
            />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);

            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}
      {isError && <BsCloudSlash className="size-4"/>}
       {!showError && !showLoader && <BsCloudCheck />}
       {showLoader && <LoaderIcon className="size-4 animate-spin text-muted-foreground"/>}
    </div>
  );
};
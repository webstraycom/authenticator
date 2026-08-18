"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { SearchIcon } from "lucide-react"

function Command({
  className,
  ...props
}) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        className
      )}
      {...props} />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden rounded-xl! p-0 mt-5 top-[12%] -translate-y-0", className)}
        showCloseButton={showCloseButton}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandFooter({
  className,
  ...props
}) {
  return (
    <DialogFooter
      data-slot="command-footer"
      className={cn(
        "mx-0 mb-0 -mx-1 -mb-1 mt-auto p-2", 
        className
      )}
      {...props} />
  );
}

function CommandInput({
  className,
  ...props
}) {
  return (
    <div data-slot="command-input-wrapper" className="p-1">
      <InputGroup
        className="h-8! rounded-lg! border-none !bg-transparent shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props} />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end" className="pr-1">
          <Kbd>Esc</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function CommandList({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-70 scroll-py-2 overflow-x-hidden overflow-y-auto outline-none border-t",
        className
      )}
      {...props} />
  );
}

function CommandEmpty({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props} />
  );
}

function CommandGroup({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 pb-2 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props} />
  );
}

function CommandSeparator({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props} />
  );
}

function CommandItem({
  className,
  children,
  ...props
}) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-2 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
        className
      )}
      {...props}>
      {children}
    </CommandPrimitive.Item>
  );
}

function CommandType({
  className,
  ...props
}) {
  return (
    <span
      data-slot="command-type"
      className={cn(
        "ml-auto text-xs text-muted-foreground",
        className
      )}
      {...props} />
  );
}

export {
  Command,
  CommandDialog,
  CommandFooter,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandType,
  CommandSeparator,
}

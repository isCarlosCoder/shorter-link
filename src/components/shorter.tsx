'use client'

import {
  Button
} from "@/components/ui/button"
import { saveLink } from "@/service/saveLink"
import { Copy } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Toaster } from "./ui/toaster"
import { useToast } from "./ui/use-toast"


export function Shorter() {
  const { toast } = useToast()
  const [link, setLink] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [shorterLink, setShorterLink] = useState<string>('')

  async function handleSubmitLink() {
    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    if (!expression.test(link)) {
      return toast({
        title: 'Error checking URL',
        description: 'Please provide a real url.',
        variant: 'destructive'
      })
    }

    const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_'
    let randomName = ''

    for (let i = 0; i < 8; i++) {
      randomName += symbols[Math.floor(Math.random() * symbols.length)]
    }

    const shortenedLink = `${window.location.href.endsWith('/') ? window.location.href : window.location.href + '/'}r/${randomName}`

    await saveLink(link, shortenedLink, randomName)

    setShorterLink(shortenedLink)
    setDialogOpen(true)
  }

  return (
    <div className="w-full h-screen bg-white dark:bg-gray-800 p-8">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">URL Shortener</h1>
        <div className="w-full max-w-md">
          <div className="rounded-md shadow-sm">

            <input
              placeholder="Your link"
              className="block border border-black/10 w-full text-lg py-3 px-4 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmitLink} className="w-full mt-4 py-2 rounded-b-md" type="submit">
            Shorten URL
          </Button>

          <Dialog open={dialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Shortening your link</DialogTitle>
                <DialogDescription>Please, wait while we are shortening your link...</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2 my-4 relative">
                <input
                  value={shorterLink}
                  disabled
                  className="flex-1 border p-2 rounded-lg pr-10"
                />
                <Button onClick={async () => {
                  await navigator.clipboard.writeText(shorterLink)
                  toast({
                    title: 'Success',
                    description: 'Link copied to your clipboard'
                  })
                }} className="absolute right-0 rounded-none rounded-r-lg">
                  <Copy size={14} />
                </Button>
              </div>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

// https://iscarloscoder.com.br/blog/tipos-primitivos-e-manipulacao-de-dados-em-javascript-com-nodejs-v21-3-2-em-2024
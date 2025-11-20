'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImagePlus, Send, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string(),
  image: z.string().optional(),
});

type Props = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
};

export function ChatInput({ onSubmit, isLoading }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      image: '',
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (!values.prompt && !values.image) return;
    onSubmit(values);
    form.reset();
    setPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue('image', dataUri);
        setPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    form.setValue('image', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(handleFormSubmit)();
    }
  };


  return (
    <div className="px-4 pb-4 w-full max-w-3xl mx-auto">
       <div className="relative">
        {preview && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-background border rounded-lg">
              <div className="relative w-20 h-20 rounded-md overflow-hidden">
                <Image src={preview} alt="Image preview" fill className="object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-6 w-6 bg-black/50 hover:bg-black/75 text-white"
                  onClick={clearPreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="relative flex items-end gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={isLoading}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              type="button"
              className='absolute left-2 bottom-2'
            >
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Attach file</span>
            </Button>

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder={"Message Wisdom AI..."}
                      {...field}
                      disabled={isLoading}
                      autoComplete="off"
                      className="bg-background/80 border rounded-xl shadow-sm min-h-[52px] resize-none py-3 pl-12 pr-12 text-base"
                      onKeyDown={handleKeyDown}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" size="icon" disabled={isLoading || (!form.getValues('prompt') && !form.getValues('image'))} className="absolute right-2 bottom-2 h-8 w-8">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

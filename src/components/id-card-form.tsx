'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import QRCode from 'qrcode';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { IDCard } from '@/lib/types';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { useLanguage } from '@/context/language-context';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  photo: z.any().refine(file => file instanceof File, 'Photo is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Must be a valid 12-digit number').optional().or(z.literal('')),
});

interface IdCardFormProps {
  onAddCard: (card: Omit<IDCard, 'userId' | 'createdAt'>) => void;
}

export function IdCardForm({ onAddCard }: IdCardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', dateOfBirth: '', address: '', aadhaarNumber: '' },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const reader = new FileReader();
    reader.readAsDataURL(values.photo);
    reader.onloadend = async () => {
      try {
        const photoDataUri = reader.result as string;
        const id = `${Date.now()}`;
        const idNumber = `IDC-${Math.random().toString().slice(2, 14)}`;
        
        const qrCodeContent = JSON.stringify({
            name: values.name,
            dob: values.dateOfBirth,
            id: idNumber,
        });
        const qrCodeDataUri = await QRCode.toDataURL(qrCodeContent);

        const newCard: Omit<IDCard, 'userId' | 'createdAt'> = {
          id,
          idNumber,
          name: values.name,
          dateOfBirth: values.dateOfBirth,
          photoDataUri,
          gender: values.gender,
          address: values.address,
          qrCodeDataUri,
          aadhaarNumber: values.aadhaarNumber || null,
        };

        onAddCard(newCard);
        toast({
          title: 'ID Card Created',
          description: `${values.name}'s ID card has been added.`,
        });
        form.reset();
        setPhotoPreview(null);
      } catch (err) {
        console.error("Failed to generate QR code or create card", err);
        toast({
          variant: "destructive",
          title: 'Error',
          description: 'Failed to generate QR code.',
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.onerror = () => {
       toast({
        variant: "destructive",
        title: 'Error',
        description: 'Failed to read photo file.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Create New ID Card')}</CardTitle>
        <CardDescription>{t('Fill in the details to generate a new digital ID card.')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Full Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789012" {...field} />
                  </FormControl>
                  <FormDescription>Used for data matching during verification.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Date of Birth')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('Gender')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('Male')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('Female')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Other" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('Other')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Address')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main St, Anytown, USA"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={() => (
                <FormItem>
                  <FormLabel>{t('Photo')}</FormLabel>
                   {photoPreview ? (
                     <div className="relative w-32 h-32">
                        <Image src={photoPreview} alt="Photo preview" layout="fill" className="rounded-md object-cover"/>
                     </div>
                   ) : (
                    <FormControl>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{t('Click to upload')}</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                    </FormControl>
                   )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('Generate ID Card')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

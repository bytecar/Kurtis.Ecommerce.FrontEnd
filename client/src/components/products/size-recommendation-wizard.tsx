import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, RulerIcon, Shirt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SizeOption } from './size-selector';

// Define schema for the wizard form with translation function
const sizeFormSchema = z.object({
  height: z.string().min(1, { message: 'Please enter your height' }),
  weight: z.string().min(1, { message: 'Please enter your weight' }),
  age: z.string().min(1, { message: 'Please enter your age' }),
  bodyType: z.enum(['slim', 'athletic', 'average', 'curvy', 'plus']),
  measureChest: z.string().optional(),
  measureWaist: z.string().optional(),
  measureHips: z.string().optional(),
  useInches: z.boolean().default(false),
  preferredFit: z.enum(['tight', 'regular', 'loose']).default('regular'),
});

type SizeFormValues = z.infer<typeof sizeFormSchema>;

interface SizeRecommendationWizardProps {
  productType: string;
  productGender: string;
  availableSizes: SizeOption[];
  onSizeSelect: (size: string) => void;
}

interface UserMeasurements {
  height: number;
  weight: number;
  age: number;
  bodyType: string;
  chest?: number;
  waist?: number;
  hips?: number;
  preferredFit: string;
}

export function SizeRecommendationWizard({
  productType,
  productGender,
  availableSizes,
  onSizeSelect,
}: SizeRecommendationWizardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [calculatingSize, setCalculatingSize] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [virtualTryOnUrl, setVirtualTryOnUrl] = useState<string | null>(null);

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: {
      height: '',
      weight: '',
      age: '',
      bodyType: 'average',
      measureChest: '',
      measureWaist: '',
      measureHips: '',
      useInches: false,
      preferredFit: 'regular',
    },
  });

  const watchUseInches = form.watch('useInches');
  const bodyType = form.watch('bodyType');
  const preferredFit = form.watch('preferredFit');

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const calculateRecommendedSize = (data: SizeFormValues) => {
    setCalculatingSize(true);
    
    // In a real app, this would be an API call to a size prediction model
    setTimeout(() => {
      // Convert the form data to measurements
      const measurements: UserMeasurements = {
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        age: parseInt(data.age),
        bodyType: data.bodyType,
        preferredFit: data.preferredFit,
      };
      
      if (data.measureChest) measurements.chest = parseFloat(data.measureChest);
      if (data.measureWaist) measurements.waist = parseFloat(data.measureWaist);
      if (data.measureHips) measurements.hips = parseFloat(data.measureHips);
      
      // Normalize measurements if they're in inches
      if (data.useInches) {
        if (measurements.height) measurements.height = measurements.height * 2.54;
        if (measurements.chest) measurements.chest = measurements.chest * 2.54;
        if (measurements.waist) measurements.waist = measurements.waist * 2.54;
        if (measurements.hips) measurements.hips = measurements.hips * 2.54;
      }
      
      // Simplified size prediction logic (this would be much more sophisticated in a real application)
      let sizePrediction = '';
      
      // Simple example logic for women's ethnic wear
      if (productGender === 'women' && productType.includes('saree')) {
        // Sarees are typically one-size-fits-all, but blouses need sizing
        sizePrediction = determineSareeBlouseSize(measurements);
      } else if (productGender === 'women' && ['kurti', 'kurta', 'suit'].some(type => productType.includes(type))) {
        // Women's kurtas and suits
        sizePrediction = determineWomensKurtaSize(measurements);
      } else if (productGender === 'men' && ['kurta', 'sherwani'].some(type => productType.includes(type))) {
        // Men's kurtas and sherwanis
        sizePrediction = determineMensKurtaSize(measurements);
      } else {
        // Default case - use a simple height/weight based approach
        sizePrediction = determineGeneralSize(measurements);
      }
      
      // Check if predicted size is available
      const availableSize = adjustToAvailableSize(sizePrediction, availableSizes);
      
      // Generate a mock try-on image URL
      // In a real app, this would call a service that generates a visualization
      const mockTryOnImage = `https://images.unsplash.com/photo-${productGender === 'women' ? '1614069565320-3cb05f7a6462' : '1551701741-da1aacc8c1bf'}?auto=format&fit=crop&q=80&w=500`;
      
      setRecommendedSize(availableSize);
      setVirtualTryOnUrl(mockTryOnImage);
      setCalculatingSize(false);
      setStep(3); // Move to results step
    }, 1500);
  };

  const determineSareeBlouseSize = (measurements: UserMeasurements): string => {
    if (!measurements.chest) return 'M';
    
    // Simplified blouse sizing based on chest measurement
    if (measurements.chest < 81) return 'XS';
    if (measurements.chest < 86) return 'S';
    if (measurements.chest < 91) return 'M';
    if (measurements.chest < 97) return 'L';
    if (measurements.chest < 107) return 'XL';
    return '2XL';
  };

  const determineWomensKurtaSize = (measurements: UserMeasurements): string => {
    // Adjust based on preferred fit
    const fitAdjustment = measurements.preferredFit === 'tight' ? -1 : 
                           measurements.preferredFit === 'loose' ? 1 : 0;
    
    // Simplified women's kurta sizing, primarily based on bust and waist
    if (measurements.chest && measurements.waist) {
      const avgMeasurement = (measurements.chest + measurements.waist) / 2;
      
      if (avgMeasurement < 81) return sizeWithAdjustment('XS', fitAdjustment);
      if (avgMeasurement < 86) return sizeWithAdjustment('S', fitAdjustment);
      if (avgMeasurement < 91) return sizeWithAdjustment('M', fitAdjustment);
      if (avgMeasurement < 97) return sizeWithAdjustment('L', fitAdjustment);
      if (avgMeasurement < 107) return sizeWithAdjustment('XL', fitAdjustment);
      return sizeWithAdjustment('2XL', fitAdjustment);
    }
    
    // Fallback to height/weight based method
    return determineGeneralSize(measurements);
  };

  const determineMensKurtaSize = (measurements: UserMeasurements): string => {
    // Adjust based on preferred fit
    const fitAdjustment = measurements.preferredFit === 'tight' ? -1 : 
                           measurements.preferredFit === 'loose' ? 1 : 0;
    
    // Simplified men's kurta sizing, primarily based on chest
    if (measurements.chest) {
      if (measurements.chest < 91) return sizeWithAdjustment('S', fitAdjustment);
      if (measurements.chest < 97) return sizeWithAdjustment('M', fitAdjustment);
      if (measurements.chest < 104) return sizeWithAdjustment('L', fitAdjustment);
      if (measurements.chest < 112) return sizeWithAdjustment('XL', fitAdjustment);
      return sizeWithAdjustment('2XL', fitAdjustment);
    }
    
    // Fallback to height/weight based method
    return determineGeneralSize(measurements);
  };

  const determineGeneralSize = (measurements: UserMeasurements): string => {
    // Very simplified general sizing based on weight and body type
    // This would be much more nuanced in a real application
    const { weight, bodyType, preferredFit } = measurements;
    
    // Base size estimation using weight ranges
    let baseSize;
    if (weight < 50) baseSize = 'XS';
    else if (weight < 60) baseSize = 'S';
    else if (weight < 75) baseSize = 'M';
    else if (weight < 90) baseSize = 'L';
    else if (weight < 105) baseSize = 'XL';
    else baseSize = '2XL';
    
    // Adjust based on body type
    let typeAdjustment = 0;
    if (bodyType === 'slim') typeAdjustment = -1;
    else if (bodyType === 'plus') typeAdjustment = 1;
    
    // Adjust based on preferred fit
    const fitAdjustment = preferredFit === 'tight' ? -1 : 
                           preferredFit === 'loose' ? 1 : 0;
    
    // Combine adjustments
    const totalAdjustment = typeAdjustment + fitAdjustment;
    
    return sizeWithAdjustment(baseSize, totalAdjustment);
  };

  const sizeWithAdjustment = (baseSize: string, adjustment: number): string => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    const baseIndex = sizeOrder.indexOf(baseSize);
    
    if (baseIndex === -1) return baseSize; // Size not found in our scale
    
    const adjustedIndex = Math.max(0, Math.min(sizeOrder.length - 1, baseIndex + adjustment));
    return sizeOrder[adjustedIndex];
  };

  const adjustToAvailableSize = (recommendedSize: string, availableSizes: SizeOption[]): string => {
    // Check if the recommended size is available
    const sizeExists = availableSizes.find(size => 
      size.value === recommendedSize && size.available
    );
    
    if (sizeExists) return recommendedSize;
    
    // If not available, find the closest available size
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    const recIndex = sizeOrder.indexOf(recommendedSize);
    
    if (recIndex === -1) {
      // If size not in our standard scale, return the first available size
      const firstAvailable = availableSizes.find(s => s.available);
      return firstAvailable ? firstAvailable.value : availableSizes[0].value;
    }
    
    // Check sizes on both sides of the recommended size
    let closestSize = null;
    let minDistance = Number.MAX_VALUE;
    
    for (const size of availableSizes) {
      if (!size.available) continue;
      
      const sizeIndex = sizeOrder.indexOf(size.value);
      if (sizeIndex === -1) continue; // Skip sizes not in our scale
      
      const distance = Math.abs(sizeIndex - recIndex);
      if (distance < minDistance) {
        minDistance = distance;
        closestSize = size.value;
      }
    }
    
    return closestSize || recommendedSize;
  };

  const handleSelectRecommendedSize = () => {
    if (recommendedSize) {
      onSizeSelect(recommendedSize);
      setOpen(false);
    }
  };

  const resetWizard = () => {
    form.reset();
    setStep(1);
    setRecommendedSize(null);
    setVirtualTryOnUrl(null);
  };

  const getUnitLabel = () => watchUseInches ? 'inches' : 'cm';
  const getWeightLabel = () => watchUseInches ? 'pounds' : 'kg';

  const bodyTypeOptions = [
    { value: 'slim', label: 'Slim' },
    { value: 'athletic', label: 'Athletic' },
    { value: 'average', label: 'Average' },
    { value: 'curvy', label: 'Curvy' },
    { value: 'plus', label: 'Plus Size' },
  ];

  const fitOptions = [
    { value: 'tight', label: 'Fitted (Closer to body)' },
    { value: 'regular', label: 'Regular (Standard fit)' },
    { value: 'loose', label: 'Loose (Relaxed fit)' },
  ];

  const renderStepOne = () => (
    <div className="space-y-4 py-4">
      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.sizeRecommender.heightLabel')}</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input 
                  placeholder={watchUseInches ? "e.g. 65" : "e.g. 165"} 
                  {...field} 
                  type="number"
                />
                <span className="flex items-center text-muted-foreground min-w-16">
                  {watchUseInches ? t('product.sizeRecommender.measurementInches') : t('product.sizeRecommender.measurementCm')}
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.sizeRecommender.weightLabel')}</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input 
                  placeholder={watchUseInches ? "e.g. 150" : "e.g. 70"} 
                  {...field} 
                  type="number"
                />
                <span className="flex items-center text-muted-foreground min-w-16">
                  {getWeightLabel()}
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.sizeRecommender.ageLabel')}</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 30" {...field} type="number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bodyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.sizeRecommender.bodyTypeLabel')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('product.sizeRecommender.selectBodyType')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {bodyTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`product.sizeRecommender.bodyTypes.${option.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="useInches"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t('product.sizeRecommender.useImperialLabel')}</FormLabel>
              <FormDescription>
                {t('product.sizeRecommender.unitSwitchDescription')}
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-4 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">{t('product.sizeRecommender.advancedMeasurementsTitle')}</h3>
        <p className="text-muted-foreground text-sm">
          {t('product.sizeRecommender.advancedMeasurementsDescription')}
        </p>
      </div>

      <Tabs defaultValue="measure" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="measure">{t('product.sizeRecommender.enterMeasurementsTab')}</TabsTrigger>
          <TabsTrigger value="guide">{t('product.sizeRecommender.measurementGuideTab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="measure" className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="measureChest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('product.sizeRecommender.chestBustLabel')}</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. 90" 
                      {...field} 
                      type="number"
                    />
                    <span className="flex items-center text-muted-foreground min-w-16">
                      {watchUseInches ? t('product.sizeRecommender.measurementInches') : t('product.sizeRecommender.measurementCm')}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measureWaist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('product.sizeRecommender.waistLabel')}</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. 75" 
                      {...field} 
                      type="number"
                    />
                    <span className="flex items-center text-muted-foreground min-w-16">
                      {watchUseInches ? t('product.sizeRecommender.measurementInches') : t('product.sizeRecommender.measurementCm')}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measureHips"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('product.sizeRecommender.hipsLabel')}</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. 95" 
                      {...field} 
                      type="number"
                    />
                    <span className="flex items-center text-muted-foreground min-w-16">
                      {watchUseInches ? t('product.sizeRecommender.measurementInches') : t('product.sizeRecommender.measurementCm')}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredFit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Fit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred fit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fitOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        <TabsContent value="guide" className="pt-4">
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="font-medium">How to Measure</h4>
            
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Chest/Bust</h5>
              <p className="text-sm text-muted-foreground">
                Measure around the fullest part of your chest/bust, keeping the tape parallel to the floor.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Waist</h5>
              <p className="text-sm text-muted-foreground">
                Measure around your natural waistline, at the narrowest part of your waist.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Hips</h5>
              <p className="text-sm text-muted-foreground">
                Measure around the fullest part of your hips, keeping the tape parallel to the floor.
              </p>
            </div>
            
            <div className="relative aspect-video mt-4 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <RulerIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">Measurement guide image</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStepThree = () => (
    <div className="py-4">
      {calculatingSize ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-center text-muted-foreground">
            Calculating your perfect size...
          </p>
        </div>
      ) : recommendedSize ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-3">
              <Shirt className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium">Your Recommended Size</h3>
            <div className="mt-2 text-4xl font-bold text-primary">{recommendedSize}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Size Details</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Product:</span>
                    <span className="font-medium">{productType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Body Type:</span>
                    <span className="font-medium">{bodyTypeOptions.find(o => o.value === bodyType)?.label}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Preferred Fit:</span>
                    <span className="font-medium">{fitOptions.find(o => o.value === preferredFit)?.label}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Virtual Try-On</h4>
                {virtualTryOnUrl ? (
                  <div className="relative rounded-md overflow-hidden aspect-[3/4]">
                    <img 
                      src={virtualTryOnUrl} 
                      alt="Virtual try-on visualization" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2">
                      <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">
                        Size {recommendedSize} visualization
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Try-on visualization unavailable
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Fit Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Based on your measurements, the {recommendedSize} size should provide a 
              {preferredFit === 'tight' ? ' fitted ' : 
               preferredFit === 'loose' ? ' relaxed ' : 
               ' comfortable '} 
              fit for your {bodyTypeOptions.find(o => o.value === bodyType)?.label.toLowerCase()} body type.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-muted-foreground">
            Something went wrong. Please try again.
          </p>
          <Button variant="outline" onClick={resetWizard} className="mt-4">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <RulerIcon className="h-4 w-4" />
          <span>{t('product.sizeRecommender.findYourSize')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('product.sizeRecommender.title')}</DialogTitle>
          <DialogDescription>
            {t('product.sizeRecommender.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateRecommendedSize)}>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              {step === 1 && renderStepOne()}
              {step === 2 && renderStepTwo()}
              {step === 3 && renderStepThree()}
            </div>

            <DialogFooter className="flex items-center justify-between mt-4 gap-2">
              {step === 1 ? (
                <>
                  <div />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      disabled={!form.formState.isValid || 
                        !form.getValues().height || 
                        !form.getValues().weight || 
                        !form.getValues().age}
                    >
                      {t('product.sizeRecommender.nextButton')}
                    </Button>
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    {t('product.sizeRecommender.backButton')}
                  </Button>
                  <Button type="submit">{t('product.sizeRecommender.calculateButton')}</Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetWizard}
                  >
                    {t('product.sizeRecommender.tryAgain')}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSelectRecommendedSize}
                    disabled={!recommendedSize}
                  >
                    {t('product.sizeRecommender.selectSizeButton')}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
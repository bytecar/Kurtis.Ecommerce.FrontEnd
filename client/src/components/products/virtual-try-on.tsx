import React, { useState, useEffect } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Loader2, Camera, Upload, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@shared/schema';
import { Card } from '@/components/ui/card';

interface VirtualTryOnProps {
  product: Product;
  selectedSize: string | null;
}

const DEFAULT_MODEL_IMAGE = 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?auto=format&fit=crop&q=80&w=1000';

export function VirtualTryOn({ product, selectedSize }: VirtualTryOnProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('model');
  const [selectedModel, setSelectedModel] = useState('default');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [virtualTryOnImage, setVirtualTryOnImage] = useState<string | null>(null);

  // Reset states when dialog closes
  useEffect(() => {
    if (!open) {
      setIsGenerating(false);
      setVirtualTryOnImage(null);
    }
  }, [open]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setUserImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateTryOn = async () => {
    if (!selectedSize) return;
    
    setIsGenerating(true);
    
    // In a real application, this would call an AI model API to generate the try-on image
    // For this demo, we'll simulate API call with a delay and use placeholder images
    setTimeout(() => {
      // For demonstration purposes, use placeholder images
      const placeholderImages = {
        default: 'https://images.unsplash.com/photo-1624043209005-152535822cbb?auto=format&fit=crop&q=80&w=500',
        model1: 'https://images.unsplash.com/photo-1614069565320-3cb05f7a6462?auto=format&fit=crop&q=80&w=500',
        model2: 'https://images.unsplash.com/photo-1621784563286-3dc8ae63e3b1?auto=format&fit=crop&q=80&w=500',
        model3: 'https://images.unsplash.com/photo-1566689476264-847d0bfcbf89?auto=format&fit=crop&q=80&w=500',
        upload: userImage || DEFAULT_MODEL_IMAGE,
      };

      // Use the appropriate image based on selected model or uploaded image
      const baseImage = activeTab === 'model' 
        ? placeholderImages[selectedModel as keyof typeof placeholderImages] || placeholderImages.default
        : placeholderImages.upload;
      
      setVirtualTryOnImage(baseImage);
      setIsGenerating(false);
    }, 2000);
  };

  const ModelButton = ({ id, src, label }: { id: string, src: string, label: string }) => (
    <button
      type="button"
      className={`p-1 rounded-md overflow-hidden border-2 transition-all ${
        selectedModel === id ? 'border-primary' : 'border-transparent hover:border-primary/50'
      }`}
      onClick={() => setSelectedModel(id)}
    >
      <div className="aspect-[3/4] w-full rounded-sm overflow-hidden">
        <img 
          src={src} 
          alt={label} 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs mt-1 block">{label}</span>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Camera className="h-4 w-4" />
          <span>Virtual Try-On</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Virtual Try-On</DialogTitle>
          <DialogDescription>
            Visualize how this {product.category} will look on you
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="model" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="model">Choose Model</TabsTrigger>
              <TabsTrigger value="upload">Upload Your Photo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="model" className="mt-4">
              <div className="grid grid-cols-4 gap-2">
                <ModelButton 
                  id="default" 
                  src="https://images.unsplash.com/photo-1600167651261-8c0da6ff2c09?auto=format&fit=crop&q=80&w=300" 
                  label="Default"
                />
                <ModelButton 
                  id="model1" 
                  src="https://images.unsplash.com/photo-1582015907937-ac7dfa31a3b5?auto=format&fit=crop&q=80&w=300" 
                  label="Model 1"
                />
                <ModelButton 
                  id="model2" 
                  src="https://images.unsplash.com/photo-1624043209005-152535822cbb?auto=format&fit=crop&q=80&w=300" 
                  label="Model 2"
                />
                <ModelButton 
                  id="model3" 
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300" 
                  label="Model 3"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <Label htmlFor="picture">Upload your full-body photo</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="border-2 border-dashed rounded-md p-4 text-center hover:border-primary transition-colors">
                      <Input 
                        id="picture" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="picture" 
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {userImage ? 'Change Photo' : 'Upload Photo'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Click to browse files
                        </span>
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      For best results, use a photo with a plain background where you are standing straight.
                    </p>
                  </div>
                  
                  <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
                    {userImage ? (
                      <img 
                        src={userImage} 
                        alt="Your uploaded photo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <Camera className="h-8 w-8 mb-2 text-muted-foreground opacity-50" />
                        <p className="text-sm text-muted-foreground text-center">
                          Your photo will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Selected Product</h4>
                <div className="aspect-[3/4] rounded-md overflow-hidden">
                  <img 
                    src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                      ? product.imageUrls[0]
                      : "https://placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-sm">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-muted-foreground">Size: {selectedSize || 'Not selected'}</p>
                </div>
              </Card>
              
              <Card className="p-4 bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Virtual Try-On</h4>
                <div className="aspect-[3/4] rounded-md overflow-hidden relative bg-muted">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Generating preview...</p>
                    </div>
                  ) : virtualTryOnImage ? (
                    <>
                      <img 
                        src={virtualTryOnImage} 
                        alt="Virtual try-on" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground opacity-50 mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Click "Generate" to create a virtual try-on
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            onClick={generateTryOn}
            disabled={
              isGenerating || 
              !selectedSize || 
              (activeTab === 'upload' && !userImage)
            }
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : virtualTryOnImage ? 'Regenerate' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
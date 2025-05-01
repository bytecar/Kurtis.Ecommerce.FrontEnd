import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, Upload } from 'lucide-react';
import { Product } from '@shared/schema';

// Model types as standalone components
const WomenModelOne = () => (
  <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=500" 
    alt="Women model 1" className="w-full h-full object-cover" />
);

const WomenModelTwo = () => (
  <img src="https://images.unsplash.com/photo-1583395149979-f3037723c640?auto=format&fit=crop&q=80&w=500" 
    alt="Women model 2" className="w-full h-full object-cover" />
);

const WomenModelThree = () => (
  <img src="https://images.unsplash.com/photo-1614886145232-246605739502?auto=format&fit=crop&q=80&w=500" 
    alt="Women model 3" className="w-full h-full object-cover" />
);

const WomenModelFour = () => (
  <img src="https://images.unsplash.com/photo-1614886145019-3ed81d51d114?auto=format&fit=crop&q=80&w=500" 
    alt="Women model 4" className="w-full h-full object-cover" />
);

const MenModelOne = () => (
  <img src="https://images.unsplash.com/photo-1558310356-c1e1c6b1e472?auto=format&fit=crop&q=80&w=500" 
    alt="Men model 1" className="w-full h-full object-cover" />
);

const MenModelTwo = () => (
  <img src="https://images.unsplash.com/photo-1594549181132-9045fed330ce?auto=format&fit=crop&q=80&w=500" 
    alt="Men model 2" className="w-full h-full object-cover" />
);

const MenModelThree = () => (
  <img src="https://images.unsplash.com/photo-1574791600523-de05d8686881?auto=format&fit=crop&q=80&w=500" 
    alt="Men model 3" className="w-full h-full object-cover" />
);

const MenModelFour = () => (
  <img src="https://images.unsplash.com/photo-1603915402597-5dd3ea5f676b?auto=format&fit=crop&q=80&w=500" 
    alt="Men model 4" className="w-full h-full object-cover" />
);

interface VirtualTryOnProps {
  product: Product;
  selectedSize: string;
}

export default function DirectVirtualTryOn({ product, selectedSize }: VirtualTryOnProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('model');
  const [selectedModel, setSelectedModel] = useState<number>(1);
  const [userImage, setUserImage] = useState<string | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUserImage(result);
    };
    reader.readAsDataURL(file);
  };

  // Render the appropriate model based on gender and model selection
  const renderModelPreview = () => {
    const isWomen = product.gender === 'women';
    
    if (activeTab === 'upload' && userImage) {
      return (
        <img 
          src={userImage} 
          alt="Your uploaded photo" 
          className="w-full h-full object-cover"
        />
      );
    }
    
    if (isWomen) {
      switch (selectedModel) {
        case 1: return <WomenModelOne />;
        case 2: return <WomenModelTwo />;
        case 3: return <WomenModelThree />;
        case 4: return <WomenModelFour />;
        default: return <WomenModelOne />;
      }
    } else {
      switch (selectedModel) {
        case 1: return <MenModelOne />;
        case 2: return <MenModelTwo />;
        case 3: return <MenModelThree />;
        case 4: return <MenModelFour />;
        default: return <MenModelOne />;
      }
    }
  };

  // Render model thumbnails based on gender
  const renderModelThumbnails = () => {
    const isWomen = product.gender === 'women';
    
    if (isWomen) {
      return (
        <div className="grid grid-cols-4 gap-2">
          <ModelButton id={1} src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300" label="Model 1" />
          <ModelButton id={2} src="https://images.unsplash.com/photo-1583395149979-f3037723c640?auto=format&fit=crop&q=80&w=300" label="Model 2" />
          <ModelButton id={3} src="https://images.unsplash.com/photo-1614886145232-246605739502?auto=format&fit=crop&q=80&w=300" label="Model 3" />
          <ModelButton id={4} src="https://images.unsplash.com/photo-1614886145019-3ed81d51d114?auto=format&fit=crop&q=80&w=300" label="Model 4" />
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-4 gap-2">
          <ModelButton id={1} src="https://images.unsplash.com/photo-1558310356-c1e1c6b1e472?auto=format&fit=crop&q=80&w=300" label="Model 1" />
          <ModelButton id={2} src="https://images.unsplash.com/photo-1594549181132-9045fed330ce?auto=format&fit=crop&q=80&w=300" label="Model 2" />
          <ModelButton id={3} src="https://images.unsplash.com/photo-1574791600523-de05d8686881?auto=format&fit=crop&q=80&w=300" label="Model 3" />
          <ModelButton id={4} src="https://images.unsplash.com/photo-1603915402597-5dd3ea5f676b?auto=format&fit=crop&q=80&w=300" label="Model 4" />
        </div>
      );
    }
  };

  const ModelButton = ({ id, src, label }: { id: number, src: string, label: string }) => (
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
          <DialogTitle>Virtual Try-On Preview</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="model" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="model">Choose Model</TabsTrigger>
              <TabsTrigger value="upload">Upload Your Photo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="model" className="mt-4">
              {renderModelThumbnails()}
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
            <h3 className="text-sm font-medium mb-3">Try-On Preview</h3>
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
                <h4 className="text-sm font-medium mb-2">On Model</h4>
                <div className="aspect-[3/4] rounded-md overflow-hidden relative bg-muted">
                  {renderModelPreview()}
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
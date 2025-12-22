import { Phone, Mail, MapPin, Clock, Send, Calendar as CalendarIcon, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { downloadVCard } from '@/utils/generateVCard';
import { detectDeviceType, detectBrowser, getVisitorLocation } from '@/utils/detectDevice';
import { useEntryMode } from '@/hooks/useEntryMode';
import { calculateEstimate, formatLakhs, getSizeLabel, type ScopeOfWork, type FinishLevel, type StorageRequirement, type PropertyStatus, type BHKSize } from '@/utils/estimateCalculator';
import { trackEstimateGenerateClicked, trackEstimateGenerated, trackDesignMySpaceClicked } from '@/utils/analytics';

const Contact = () => {
  const [projectType, setProjectType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [apartmentSize, setApartmentSize] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [consultationDate, setConsultationDate] = useState<Date>();
  const [propertyLocation, setPropertyLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New estimate fields
  const [scopeOfWork, setScopeOfWork] = useState<ScopeOfWork | ''>('');
  const [finishLevel, setFinishLevel] = useState<FinishLevel | ''>('');
  const [storageRequirement, setStorageRequirement] = useState<StorageRequirement | ''>('');
  const [upgrades, setUpgrades] = useState<string[]>([]);
  
  // Estimate state
  const [estimateResult, setEstimateResult] = useState<{
    totalLow: number;
    totalHigh: number;
    breakdown: {
      carpentryLow: number;
      carpentryHigh: number;
      electricalLow: number;
      electricalHigh: number;
      paintingLow: number;
      paintingHigh: number;
      renovationMultiplier: number;
      finishMultiplier: number;
      storageMultiplier: number;
      sizeMultiplier: number;
      bhkSize: BHKSize;
    };
  } | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [estimateWasGenerated, setEstimateWasGenerated] = useState(false);
  const [highlightMissingFields, setHighlightMissingFields] = useState(false);
  
  const { entryMode, setEntryMode } = useEntryMode();
  const { toast } = useToast();
  
  // Refs for scrolling to missing fields
  const locationRef = useRef<HTMLDivElement>(null);
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<HTMLDivElement>(null);
  const storageRef = useRef<HTMLDivElement>(null);
  const upgradesRef = useRef<HTMLDivElement>(null);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 99083 92200',
      action: 'tel:+919908392200'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'mokhadesigns@outlook.com',
      action: 'mailto:mokhadesigns@outlook.com'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'Hyderabad, India',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon - Fri: 9:00 AM - 6:00 PM',
      action: '#'
    }
  ];

  // Check if all estimate required fields are filled
  const isEstimateReady = () => {
    return (
      propertyLocation &&
      projectType === 'residential' &&
      propertyType &&
      apartmentSize &&
      propertyStatus &&
      scopeOfWork &&
      finishLevel &&
      storageRequirement &&
      upgrades.length > 0
    );
  };

  // Find first missing estimate field and scroll to it
  const scrollToFirstMissingField = () => {
    if (!propertyLocation) {
      locationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (projectType !== 'residential') {
      // Can't estimate for commercial
      toast({
        title: "Residential Only",
        description: "Cost estimates are currently available for residential projects only.",
        variant: "destructive",
      });
      return;
    }
    if (!propertyType) {
      propertyTypeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!apartmentSize) {
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!propertyStatus) {
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!scopeOfWork) {
      scopeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!finishLevel) {
      finishRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!storageRequirement) {
      storageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (upgrades.length === 0) {
      upgradesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  };

  // Reset highlight when entry mode changes (removed auto-focus behavior)

  const handleUpgradeChange = (upgrade: string, checked: boolean) => {
    if (checked) {
      // If selecting "No major changes", clear other selections
      if (upgrade === 'no-changes') {
        setUpgrades(['no-changes']);
      } else {
        // Remove "no-changes" if selecting other options
        setUpgrades(prev => [...prev.filter(u => u !== 'no-changes'), upgrade]);
      }
    } else {
      setUpgrades(prev => prev.filter(u => u !== upgrade));
    }
  };

  // Phone validation helper
  const isValidPhone = (phone: string): boolean => {
    // Allow digits, spaces, hyphens, parentheses, and optional leading +
    // Must have at least 10 digits
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  // Check if contact fields are valid for estimate
  const areContactFieldsValid = (): { valid: boolean; message?: string } => {
    const formElement = document.querySelector('form') as HTMLFormElement;
    if (!formElement) return { valid: false, message: "Form not found" };
    
    const formData = new FormData(formElement);
    const name = (formData.get('name') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    
    if (!name) {
      return { valid: false, message: "Please enter your name." };
    }
    if (name.length < 2) {
      return { valid: false, message: "Name must be at least 2 characters." };
    }
    if (!phone) {
      return { valid: false, message: "Please enter your phone number." };
    }
    if (!isValidPhone(phone)) {
      return { valid: false, message: "Please enter a valid phone number (at least 10 digits)." };
    }
    if (!propertyLocation) {
      return { valid: false, message: "Please select a property location." };
    }
    if (!projectType) {
      return { valid: false, message: "Please select a project type." };
    }
    
    return { valid: true };
  };

  const handleGenerateEstimate = async () => {
    trackEstimateGenerateClicked();
    
    // First validate contact fields (mandatory for estimate too)
    const contactValidation = areContactFieldsValid();
    if (!contactValidation.valid) {
      toast({
        title: "Missing Information",
        description: contactValidation.message,
        variant: "destructive",
      });
      return;
    }
    
    // Then validate estimate-specific fields
    if (!isEstimateReady()) {
      setHighlightMissingFields(true);
      scrollToFirstMissingField();
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate an estimate.",
        variant: "destructive",
      });
      return;
    }

    // Calculate estimate
    const hasElectricalChanges = upgrades.includes('electrical');
    const hasPaintingChanges = upgrades.includes('painting');
    
    const result = calculateEstimate({
      scope: scopeOfWork as ScopeOfWork,
      finish: finishLevel as FinishLevel,
      storage: storageRequirement as StorageRequirement,
      hasElectricalChanges,
      hasPaintingChanges,
      propertyStatus: propertyStatus as PropertyStatus,
      bhkSize: apartmentSize as BHKSize,
    });

    setEstimateResult(result);
    setEstimateWasGenerated(true);

    // Track analytics
    trackEstimateGenerated({
      scope: scopeOfWork,
      finish: finishLevel,
      storage: storageRequirement,
      upgrades,
      status: propertyStatus,
      location: propertyLocation,
      totalLow: result.totalLow,
      totalHigh: result.totalHigh,
      entryMode: entryMode || 'direct',
      bhkSize: apartmentSize,
      sizeMultiplier: result.breakdown.sizeMultiplier,
    });

    // Also submit the lead
    await submitLead(true);
  };

  const submitLead = async (fromEstimate: boolean = false) => {
    setIsSubmitting(true);

    try {
      const formElement = document.querySelector('form') as HTMLFormElement;
      const formData = new FormData(formElement);
      
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      const email = formData.get('email') as string;
      const commercialSize = formData.get('commercial-size') as string;

      // Validate required fields
      if (!name || !phone || !propertyLocation || !projectType) {
        if (!fromEstimate) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
        return false;
      }

      // Collect visitor metadata
      const deviceType = detectDeviceType();
      const browser = detectBrowser();
      const visitorLocation = await getVisitorLocation();

      // Prepare submission data with new fields
      const submissionData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || '',
        propertyLocation,
        projectType,
        propertyType: propertyType || '',
        propertySize: projectType === 'commercial' ? commercialSize : apartmentSize,
        propertyStatus: propertyStatus || '',
        nextStep,
        consultationDate: consultationDate ? format(consultationDate, 'PPP') : '',
        visitorLocation,
        deviceType,
        browser,
        // New estimate fields
        scopeOfWork: scopeOfWork || '',
        finishLevel: finishLevel || '',
        storageRequirement: storageRequirement || '',
        upgrades: upgrades.join(', '),
        entryMode: entryMode || 'direct',
        estimateGenerated: fromEstimate,
        estimateLow: estimateResult?.totalLow || null,
        estimateHigh: estimateResult?.totalHigh || null,
        bhkSize: apartmentSize || '',
        sizeMultiplier: estimateResult?.breakdown.sizeMultiplier || null,
      };

      console.log('Submitting form data:', submissionData);

      // Call edge function to submit to Google Sheets
      const { data, error } = await supabase.functions.invoke('submit-contact-form', {
        body: submissionData,
      });

      if (error) {
        console.error('Error submitting form:', error);
        throw error;
      }

      console.log('Form submitted successfully:', data);
      return true;

    } catch (error) {
      console.error('Form submission error:', error);
      if (!fromEstimate) {
        toast({
          title: "Submission Failed",
          description: "Unable to submit form. Please try again or call us directly.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    trackDesignMySpaceClicked({
      entryMode: entryMode || 'direct',
      estimateWasGenerated,
    });

    const success = await submitLead(false);
    
    if (success) {
      // Show success message
      if (nextStep === 'direct-call') {
        toast({
          title: "Thank You!",
          description: "Your information has been saved. Save our contact to call us.",
        });
        // Trigger vCard download
        downloadVCard();
      } else {
        toast({
          title: "Thank You!",
          description: "We'll contact you soon to schedule your consultation.",
        });
      }

      // Reset form
      const formElement = e.currentTarget;
      formElement.reset();
      setProjectType('');
      setPropertyType('');
      setApartmentSize('');
      setPropertyStatus('');
      setNextStep('');
      setConsultationDate(undefined);
      setPropertyLocation('');
      setScopeOfWork('');
      setFinishLevel('');
      setStorageRequirement('');
      setUpgrades([]);
      setEstimateResult(null);
      setEstimateWasGenerated(false);
      setHighlightMissingFields(false);
      setEntryMode(null);
    }
  };

  const getMissingFieldClass = (value: string | string[]) => {
    if (!highlightMissingFields) return '';
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
    return isEmpty ? 'ring-2 ring-destructive/50 ring-offset-2' : '';
  };

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your space? Contact us for a free consultation 
            and let's discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-8">
              Let's Start Your Project
            </h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                    {info.action.startsWith('#') ? (
                      <p className="text-muted-foreground">{info.details}</p>
                    ) : (
                      <a 
                        href={info.action}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.details}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-heading font-semibold text-foreground mb-4">
                Why Choose Mokha Designs?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Free consultation and quote</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Turnkey solutions from design to furnishing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Experienced team of professionals</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Quality materials and timely delivery</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="elegant-card">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Begin Your Design Journey With Us
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    className="bg-background border-border mt-2"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number *
                    </Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel" 
                      placeholder="+91 Your phone number"
                      className="bg-background border-border mt-2"
                      required
                      pattern="[+]?[0-9\s\-\(\)]+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="your@email.com"
                      className="bg-background border-border mt-2"
                    />
                  </div>
                </div>

                <div ref={locationRef} className={cn("rounded-lg", getMissingFieldClass(propertyLocation))}>
                  <Label htmlFor="location" className="text-sm font-medium text-foreground">
                    Property Location *
                  </Label>
                  <Select value={propertyLocation} onValueChange={setPropertyLocation} required>
                    <SelectTrigger className="bg-background border-border mt-2">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="bengaluru">Bengaluru</SelectItem>
                      <SelectItem value="goa">Goa</SelectItem>
                      <SelectItem value="dubai">Dubai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    Type of Project *
                  </Label>
                  <RadioGroup value={projectType} onValueChange={setProjectType} className="flex gap-6" required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="residential" id="residential" />
                      <Label htmlFor="residential">Residential</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commercial" id="commercial" />
                      <Label htmlFor="commercial">Commercial</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Conditional: Residential Property Type */}
                {projectType === 'residential' && (
                  <div ref={propertyTypeRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(propertyType))}>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Property Type *
                    </Label>
                    <RadioGroup value={propertyType} onValueChange={setPropertyType} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="apartment" />
                        <Label htmlFor="apartment">Apartment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="villa" id="villa" />
                        <Label htmlFor="villa">Villa</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Conditional: Residential Property Size */}
                {projectType === 'residential' && (propertyType === 'apartment' || propertyType === 'villa') && (
                  <div ref={sizeRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(apartmentSize))}>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Residential Property Size *
                    </Label>
                    <RadioGroup value={apartmentSize} onValueChange={setApartmentSize} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3bhk" id="3bhk" />
                        <Label htmlFor="3bhk">3BHK</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4bhk" id="4bhk" />
                        <Label htmlFor="4bhk">4BHK</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5bhk" id="5bhk" />
                        <Label htmlFor="5bhk">5BHK+</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Conditional: Commercial Property Size */}
                {projectType === 'commercial' && (
                  <div>
                    <Label htmlFor="commercial-size" className="text-sm font-medium text-foreground">
                      Commercial Property Size (sqft) *
                    </Label>
                    <Input 
                      id="commercial-size"
                      name="commercial-size"
                      type="number" 
                      placeholder="Enter size in square feet"
                      className="bg-background border-border mt-2"
                      min="1"
                      required
                    />
                  </div>
                )}

                {/* Property Status */}
                {projectType && (
                  <div ref={statusRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(propertyStatus))}>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Status of Property *
                    </Label>
                    <RadioGroup value={propertyStatus} onValueChange={setPropertyStatus} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="under-construction" id="under-construction" />
                        <Label htmlFor="under-construction">Under construction</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="handed-over" id="handed-over" />
                        <Label htmlFor="handed-over">Handed over (new)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="renovation" id="renovation" />
                        <Label htmlFor="renovation">Renovation required</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>

              {/* New Estimate Fields - Only for Residential */}
              {projectType === 'residential' && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">Cost Estimate Details</span>
                  </div>

                  {/* Scope of Work */}
                  <div ref={scopeRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(scopeOfWork))}>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Scope of Work *
                    </Label>
                    <RadioGroup value={scopeOfWork} onValueChange={(v) => setScopeOfWork(v as ScopeOfWork)} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kitchen-only" id="kitchen-only" />
                        <Label htmlFor="kitchen-only">Kitchen only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kitchen-wardrobes" id="kitchen-wardrobes" />
                        <Label htmlFor="kitchen-wardrobes">Kitchen + Wardrobes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kitchen-wardrobes-living" id="kitchen-wardrobes-living" />
                        <Label htmlFor="kitchen-wardrobes-living">Kitchen + Wardrobes + Living / TV / Utility</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Finish Level */}
                  <div ref={finishRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(finishLevel))}>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Finish Level *
                    </Label>
                    <RadioGroup value={finishLevel} onValueChange={(v) => setFinishLevel(v as FinishLevel)} className="flex gap-4 flex-wrap">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="essential" id="essential" />
                        <Label htmlFor="essential">Essential</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="premium" />
                        <Label htmlFor="premium">Premium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="luxe" id="luxe" />
                        <Label htmlFor="luxe">Luxe</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Storage Requirement */}
                  <div ref={storageRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(storageRequirement))}>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Storage Requirement *
                    </Label>
                    <RadioGroup value={storageRequirement} onValueChange={(v) => setStorageRequirement(v as StorageRequirement)} className="flex gap-4 flex-wrap">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="heavy" id="heavy" />
                        <Label htmlFor="heavy">Heavy</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Upgrades Beyond Carpentry */}
                  <div ref={upgradesRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(upgrades))}>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Upgrades Beyond Carpentry *
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="electrical" 
                          checked={upgrades.includes('electrical')}
                          onCheckedChange={(checked) => handleUpgradeChange('electrical', checked as boolean)}
                        />
                        <Label htmlFor="electrical" className="cursor-pointer">Lighting / electrical changes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="painting" 
                          checked={upgrades.includes('painting')}
                          onCheckedChange={(checked) => handleUpgradeChange('painting', checked as boolean)}
                        />
                        <Label htmlFor="painting" className="cursor-pointer">Repainting / wall textures</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="no-changes" 
                          checked={upgrades.includes('no-changes')}
                          onCheckedChange={(checked) => handleUpgradeChange('no-changes', checked as boolean)}
                        />
                        <Label htmlFor="no-changes" className="cursor-pointer">No major changes</Label>
                      </div>
                    </div>
                  </div>

                  {/* Generate Estimate Button */}
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={handleGenerateEstimate}
                    disabled={isSubmitting}
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Generate Estimate
                  </Button>

                  {/* Estimate Result */}
                  {estimateResult && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Estimated interior cost range</p>
                        <p className="text-2xl md:text-3xl font-bold text-primary">
                          {formatLakhs(estimateResult.totalLow)} – {formatLakhs(estimateResult.totalHigh)}
                        </p>
                      </div>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        This is an estimate. Final cost depends on site measurements, detailed scope, and material selections.
                      </p>

                      {/* Optional Breakdown Toggle */}
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1 text-sm text-primary hover:underline mx-auto"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                      >
                        {showBreakdown ? 'Hide' : 'View'} breakdown
                        {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {showBreakdown && (
                        <div className="text-sm space-y-2 pt-2 border-t border-primary/20">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Carpentry</span>
                            <span className="font-medium">{formatLakhs(estimateResult.breakdown.carpentryLow)} – {formatLakhs(estimateResult.breakdown.carpentryHigh)}</span>
                          </div>
                          {(estimateResult.breakdown.electricalLow > 0 || estimateResult.breakdown.electricalHigh > 0) && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Electrical</span>
                              <span className="font-medium">+{formatLakhs(estimateResult.breakdown.electricalLow)} – {formatLakhs(estimateResult.breakdown.electricalHigh)}</span>
                            </div>
                          )}
                          {(estimateResult.breakdown.paintingLow > 0 || estimateResult.breakdown.paintingHigh > 0) && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Painting</span>
                              <span className="font-medium">+{formatLakhs(estimateResult.breakdown.paintingLow)} – {formatLakhs(estimateResult.breakdown.paintingHigh)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size factor</span>
                            <span className="font-medium">{getSizeLabel(estimateResult.breakdown.bhkSize)}</span>
                          </div>
                          {estimateResult.breakdown.renovationMultiplier > 1 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Renovation factor</span>
                              <span className="font-medium">+20%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Next Step Preference */}
              {projectType && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Next Step Preference
                    </Label>
                    <RadioGroup value={nextStep} onValueChange={setNextStep} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consultation" id="consultation" />
                        <Label htmlFor="consultation">Schedule a free consultation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="direct-call" id="direct-call" />
                        <Label htmlFor="direct-call">I'll call you directly</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Conditional: Calendar Picker */}
                  {nextStep === 'consultation' && (
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-3 block">
                        Preferred Consultation Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background border-border",
                              !consultationDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {consultationDate ? format(consultationDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
                          <Calendar
                            mode="single"
                            selected={consultationDate}
                            onSelect={setConsultationDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              )}

              {/* Privacy Notice */}
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  By submitting this form, you consent to the collection of your device and location 
                  information for service improvement purposes.
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Design My Space
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

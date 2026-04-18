import { Phone, Mail, MapPin, Clock, Send, Calendar as CalendarIcon, Calculator } from 'lucide-react';
import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { downloadVCard } from '@/utils/generateVCard';
import { detectDeviceType, detectBrowser, getVisitorLocation } from '@/utils/detectDevice';
import { useEntryMode } from '@/hooks/useEntryMode';
import { calculateEstimate, type EstimateResult, type ScopeOfWork, type PropertyStatus, type BHKSize } from '@/utils/estimateCalculator';
import { trackEstimateGenerateClicked, trackEstimateGenerated, trackDesignMySpaceClicked, trackLeadValidationFailed } from '@/utils/analytics';
import { validatePhone, normalizePhone, shouldShowValidation } from '@/utils/phoneValidation';
import { validateFullName } from '@/utils/nameValidation';
import { validateEmail } from '@/utils/emailValidation';
import WhatsAppIcon from '@/components/WhatsAppIcon';

interface ContactProps {
  embedded?: boolean;
}

const Contact = ({ embedded = false }: ContactProps) => {
  const [projectType, setProjectType] = useState('');
  const [apartmentSize, setApartmentSize] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [interiorsBudget, setInteriorsBudget] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [consultationDate, setConsultationDate] = useState<Date>();
  const [propertyLocation, setPropertyLocation] = useState('hyderabad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Intent selection - cost estimate vs consultation
  const [intent, setIntent] = useState<'estimate' | 'consultation'>('estimate');
  
  // New estimate fields
  const [scopeOfWork, setScopeOfWork] = useState<ScopeOfWork | ''>('');
  
  // Estimate state
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [estimateWasGenerated, setEstimateWasGenerated] = useState(false);
  const [highlightMissingFields, setHighlightMissingFields] = useState(false);
  
  // Phone validation state
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [phoneTouched, setPhoneTouched] = useState(false);
  
  // Name validation state
  const [nameValue, setNameValue] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [nameWarning, setNameWarning] = useState<string | undefined>();
  const [nameTouched, setNameTouched] = useState(false);
  
  // Email validation state
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [emailWarning, setEmailWarning] = useState<{ message: string; suggestedValue?: string } | undefined>();
  const [emailTouched, setEmailTouched] = useState(false);
  
  // Progress tracking for estimate flow
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const { entryMode, setEntryMode } = useEntryMode();
  const { toast } = useToast();
  
  // Sync intent with entry mode from header/hero
  useEffect(() => {
    if (entryMode === 'estimate') {
      setIntent('estimate');
    } else if (entryMode === 'consult') {
      setIntent('consultation');
    }
  }, [entryMode]);
  
  // Update step based on form progress
  useEffect(() => {
    if (intent === 'estimate') {
      if (!propertyLocation || !projectType) {
        setCurrentStep(1);
      } else if (!propertyStatus || !scopeOfWork || (scopeOfWork === 'design-execution' && !apartmentSize)) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    }
  }, [intent, propertyLocation, projectType, propertyStatus, scopeOfWork, apartmentSize]);
  
  // Refs for scrolling to missing fields
  const locationRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);

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
      propertyStatus &&
      scopeOfWork &&
      (scopeOfWork === 'design-only' || apartmentSize)
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
    if (!propertyStatus) {
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!scopeOfWork) {
      scopeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (scopeOfWork === 'design-execution' && !apartmentSize) {
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  };

  // Reset highlight when entry mode changes (removed auto-focus behavior)

  // Handle phone input change with inline validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric characters, max 10 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneValue(value);
    
    // Show validation after 4+ digits or if already touched
    if (shouldShowValidation(value) || phoneTouched) {
      const result = validatePhone(value, propertyLocation);
      setPhoneError(result.valid ? undefined : result.error);
    } else {
      setPhoneError(undefined);
    }
  };

  // Handle phone blur for validation
  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    if (phoneValue.trim()) {
      const result = validatePhone(phoneValue, propertyLocation);
      setPhoneError(result.valid ? undefined : result.error);
    } else {
      setPhoneError('Phone number is required.');
    }
  };

  // Re-validate phone when city changes
  useEffect(() => {
    if (phoneTouched && phoneValue.trim()) {
      const result = validatePhone(phoneValue, propertyLocation);
      setPhoneError(result.valid ? undefined : result.error);
    }
  }, [propertyLocation, phoneValue, phoneTouched]);

  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameValue(value);
    
    // Only validate on change if already touched
    if (nameTouched && value.trim()) {
      const result = validateFullName(value);
      setNameError(result.isValid ? undefined : result.error);
      setNameWarning(result.isValid ? result.warning : undefined);
    } else if (!value.trim() && nameTouched) {
      setNameError('Please enter your full name.');
      setNameWarning(undefined);
    }
  };

  // Handle name blur for validation
  const handleNameBlur = () => {
    setNameTouched(true);
    if (nameValue.trim()) {
      const result = validateFullName(nameValue);
      setNameError(result.isValid ? undefined : result.error);
      setNameWarning(result.isValid ? result.warning : undefined);
      if (!result.isValid && result.error) {
        trackLeadValidationFailed({ field: 'full_name', reason: result.error });
      }
    } else {
      setNameError('Please enter your full name.');
      setNameWarning(undefined);
    }
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailValue(value);
    
    // Only validate on change if already touched
    if (emailTouched && value.trim()) {
      const result = validateEmail(value);
      setEmailError(result.isValid ? undefined : result.error);
      setEmailWarning(result.isValid ? result.warning : undefined);
    } else if (!value.trim()) {
      // Email is optional, clear errors when empty
      setEmailError(undefined);
      setEmailWarning(undefined);
    }
  };

  // Handle email blur for validation
  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (emailValue.trim()) {
      const result = validateEmail(emailValue);
      setEmailError(result.isValid ? undefined : result.error);
      setEmailWarning(result.isValid ? result.warning : undefined);
      if (!result.isValid && result.error) {
        trackLeadValidationFailed({ field: 'email', reason: result.error });
      }
    } else {
      // Email is optional, clear errors when empty
      setEmailError(undefined);
      setEmailWarning(undefined);
    }
  };

  // Apply email suggestion when user clicks "Did you mean..."
  const applyEmailSuggestion = () => {
    if (emailWarning?.suggestedValue) {
      setEmailValue(emailWarning.suggestedValue);
      setEmailWarning(undefined);
    }
  };

  // Check if contact fields are valid for estimate
  const areContactFieldsValid = (): { valid: boolean; message?: string; field?: string } => {
    // Validate name using the new validation
    const nameValidation = validateFullName(nameValue);
    if (!nameValidation.isValid) {
      return { valid: false, message: nameValidation.error, field: 'name' };
    }
    
    // Validate phone
    if (!phoneValue.trim()) {
      return { valid: false, message: "Phone number is required.", field: 'phone' };
    }
    
    // Use city-aware phone validation
    const phoneValidation = validatePhone(phoneValue, propertyLocation);
    if (!phoneValidation.valid) {
      return { valid: false, message: phoneValidation.error, field: 'phone' };
    }
    
    // Validate email only if provided (it's optional)
    if (emailValue.trim()) {
      const emailValidation = validateEmail(emailValue);
      if (!emailValidation.isValid) {
        return { valid: false, message: emailValidation.error, field: 'email' };
      }
    }
    
    if (!propertyLocation) {
      return { valid: false, message: "Please select a property location.", field: 'location' };
    }
    if (!projectType) {
      return { valid: false, message: "Please select a project type.", field: 'projectType' };
    }
    
    return { valid: true };
  };

  const handleGenerateEstimate = async () => {
    trackEstimateGenerateClicked();
    
    // First validate contact fields (mandatory for estimate too)
    // Set touched state to show errors
    setNameTouched(true);
    setPhoneTouched(true);
    if (emailValue.trim()) setEmailTouched(true);
    
    const contactValidation = areContactFieldsValid();
    if (!contactValidation.valid) {
      // Track validation failure
      if (contactValidation.field === 'name') {
        trackLeadValidationFailed({ field: 'full_name', reason: contactValidation.message || 'validation_failed' });
        // Update name error state
        setNameError(contactValidation.message);
      } else if (contactValidation.field === 'email') {
        trackLeadValidationFailed({ field: 'email', reason: contactValidation.message || 'validation_failed' });
        setEmailError(contactValidation.message);
      }
      
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

    const result = calculateEstimate({
      scope: scopeOfWork as ScopeOfWork,
      propertyStatus: propertyStatus as PropertyStatus,
      bhkSize: apartmentSize ? (apartmentSize as BHKSize) : undefined,
    });

    setEstimateResult(result);
    setEstimateWasGenerated(true);

    // Track analytics
    trackEstimateGenerated({
      scope: scopeOfWork,
      status: propertyStatus,
      location: propertyLocation,
      totalLow: result.totalLow,
      totalHigh: result.totalHigh,
      entryMode: entryMode || 'direct',
      bhkSize: apartmentSize,
    });

    // Also submit the lead
    const leadSuccess = await submitLead(true);

    // Fire Meta Pixel Lead event on successful estimate submission
    if (leadSuccess && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { source: 'estimator' });
    }
  };

  const submitLead = async (fromEstimate: boolean = false) => {
    setIsSubmitting(true);

    try {
      const formElement = document.querySelector('form') as HTMLFormElement;
      const formData = new FormData(formElement);
      
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const commercialSize = formData.get('commercial-size') as string;

      // Get normalized phone number for storage
      const phoneValidation = validatePhone(phoneValue, propertyLocation);
      const normalizedPhoneDigits = phoneValidation.normalizedDigits;

      // Validate required fields
      if (!name || !phoneValue.trim() || !propertyLocation || !projectType) {
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
      // Map intent to sheet values: 'estimate' -> 'quick_estimate', 'consultation' -> 'designer_consultation'
      const intentValue = intent === 'estimate' ? 'quick_estimate' : 'designer_consultation';
      
      const submissionData = {
        name: name.trim(),
        phone: normalizedPhoneDigits, // Store normalized digits
        email: email?.trim() || '',
        propertyLocation,
        projectType,
        propertyType: '',
        propertySize: projectType === 'commercial' ? commercialSize : apartmentSize,
        propertyStatus: propertyStatus || '',
        nextStep,
        consultationDate: consultationDate ? format(consultationDate, 'PPP') : '',
        visitorLocation,
        deviceType,
        browser,
        // New estimate fields
        scopeOfWork: scopeOfWork || '',
        finishLevel: '',
        storageRequirement: '',
        upgrades: '',
        intent: intentValue, // 'quick_estimate' or 'designer_consultation'
        estimateLow: estimateResult?.totalLow ?? null,
        estimateHigh: estimateResult?.totalHigh ?? null,
        bhkSize: apartmentSize || '',
        sizeMultiplier: null,
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
      // Fire Meta Pixel Lead event on successful form submission
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { source: 'designer_cta' });
      }

      // Fire Google Ads conversion on successful form submission
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-18053594263/oTWbCKH165QcEJf5z6BD'
        });
      }

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
      setApartmentSize('');
      setPropertyStatus('');
      setNextStep('');
      setConsultationDate(undefined);
      setPropertyLocation('');
      setScopeOfWork('');
      setEstimateResult(null);
      setEstimateWasGenerated(false);
      setHighlightMissingFields(false);
      setEntryMode(null);
      // Reset phone state
      setPhoneValue('');
      setPhoneError(undefined);
      setPhoneTouched(false);
      // Reset name state
      setNameValue('');
      setNameError(undefined);
      setNameWarning(undefined);
      setNameTouched(false);
      // Reset email state
      setEmailValue('');
      setEmailError(undefined);
      setEmailWarning(undefined);
      setEmailTouched(false);
    }
  };

  const getMissingFieldClass = (value: string | string[]) => {
    if (!highlightMissingFields) return '';
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
    return isEmpty ? 'ring-2 ring-destructive/50 ring-offset-2' : '';
  };

  const intentToggle = (
    <div className="mb-6">
      <div className="flex rounded-lg bg-muted p-1 gap-1">
        <button
          type="button"
          onClick={() => setIntent('consultation')}
          className={cn(
            "flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-1",
            intent === 'consultation' 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>Book a Design Call</span>
          <span className={cn(
            "text-xs",
            intent === 'consultation' ? "text-primary-foreground/80" : "text-muted-foreground/70"
          )}>
            Discuss ideas, budget & feasibility
          </span>
        </button>
        <button
          type="button"
          onClick={() => setIntent('estimate')}
          className={cn(
            "flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-1",
            intent === 'estimate' 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>Get a Quick Estimate</span>
          <span className={cn(
            "text-xs",
            intent === 'estimate' ? "text-primary-foreground/80" : "text-muted-foreground/70"
          )}>
            ~1 minute · No commitment
          </span>
        </button>
      </div>
    </div>
  );

  const progressIndicator = intent === 'estimate' ? (
    <div className="mb-6">
      <div className="text-sm text-muted-foreground mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  ) : null;

  const formHeading = (
    <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
      {intent === 'estimate' ? 'Tell Us a Bit About Your Space' : 'Request a Consultation'}
    </h3>
  );

  const formContent = (
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
            className={cn(
              "bg-background border-border mt-2",
              nameError && nameTouched && "border-destructive focus-visible:ring-destructive"
            )}
            value={nameValue}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            required
            maxLength={100}
          />
          {nameError && nameTouched && (
            <p className="text-sm text-destructive mt-1">{nameError}</p>
          )}
          {nameWarning && !nameError && nameTouched && (
            <p className="text-sm text-amber-600 mt-1">{nameWarning}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone Number *
          </Label>
            <Input 
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="10-digit mobile number"
              className={cn(
                "bg-background border-border mt-2",
                phoneError && phoneTouched && "border-destructive focus-visible:ring-destructive"
              )}
              value={phoneValue}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              required
            />
          {phoneError && phoneTouched && (
            <p className="text-sm text-destructive mt-1">{phoneError}</p>
          )}
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
          </RadioGroup>
        </div>

        {/* Conditional: Residential Property Size */}
        {projectType === 'residential' && (
          <div ref={sizeRef} className={cn("rounded-lg p-2 -m-2", getMissingFieldClass(apartmentSize))}>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Residential Property Size{scopeOfWork === 'design-execution' ? ' *' : ''}
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
              Property Status *
            </Label>
            <RadioGroup value={propertyStatus} onValueChange={setPropertyStatus} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="handed-over" id="handed-over" />
                <Label htmlFor="handed-over">Handed Over</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-3-months" id="1-3-months" />
                <Label htmlFor="1-3-months">1–3 Months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-6-months" id="3-6-months" />
                <Label htmlFor="3-6-months">3–6 Months</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Interiors Budget */}
        {projectType && (
          <div className="rounded-lg p-2 -m-2">
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Interiors Budget *
            </Label>
            <RadioGroup value={interiorsBudget} onValueChange={setInteriorsBudget} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15-20-lakhs" id="15-20-lakhs" />
                <Label htmlFor="15-20-lakhs">15 – 20 Lakhs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="20-25-lakhs" id="20-25-lakhs" />
                <Label htmlFor="20-25-lakhs">20 – 25 Lakhs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="25-30-lakhs" id="25-30-lakhs" />
                <Label htmlFor="25-30-lakhs">25 – 30 Lakhs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="40-lakhs-plus" id="40-lakhs-plus" />
                <Label htmlFor="40-lakhs-plus">40 Lakhs+</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Estimate Fields - Only for Residential and estimate intent */}
      {projectType === 'residential' && intent === 'estimate' && (
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
                <RadioGroupItem value="design-only" id="design-only" />
                <Label htmlFor="design-only">Design Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="design-execution" id="design-execution" />
                <Label htmlFor="design-execution">Design &amp; Execution</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Generate Estimate Button */}
          <Button 
            type="button"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleGenerateEstimate}
            disabled={isSubmitting}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Generate Estimate
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            You'll also receive a detailed consultation if needed.
          </p>

          {/* Estimate Result */}
          {estimateResult && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Estimated cost</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {estimateResult.displayText}
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                This is an estimate. Final cost depends on site measurements, detailed scope, and material selections. Talk to us to get a detailed quote.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next Step Preference - for consultation intent or after estimate */}
      {projectType && (intent === 'consultation' || estimateWasGenerated) && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              {intent === 'consultation' ? 'How would you like to proceed?' : 'Next Step Preference'}
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

      {/* Submit Button - different based on intent */}
      {intent === 'consultation' && (
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
              <Phone className="w-5 h-5 mr-2" />
              Request Consultation
            </>
          )}
        </Button>
      )}
      
      {intent === 'estimate' && estimateWasGenerated && (
        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Request Detailed Quote
            </>
          )}
        </Button>
      )}
    </form>
  );

  const whatsappFooter = (
    <p className="text-center mt-4 text-sm text-muted-foreground">
      Prefer a quicker response?{' '}
      <button
        onClick={() => handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'contact_form')}
        className="whatsapp-inline-link inline-flex items-center gap-2 font-medium underline hover:no-underline"
      >
        <WhatsAppIcon className="w-4 h-4" withBubble />
        Chat on WhatsApp
      </button>
    </p>
  );

  if (embedded) {
    return (
      <div className="font-sans p-2">
        {intentToggle}
        {progressIndicator}
        {formHeading}
        {formContent}
        {whatsappFooter}
      </div>
    );
  }

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Get a Quick Estimate for Your Space
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Answer a few quick questions to see an approximate estimate range.
            <br className="hidden sm:block" />
            Or speak with a designer if you'd like guidance before deciding.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form - First column for priority visibility */}
          <div className="elegant-card font-sans">
            {intentToggle}
            {progressIndicator}
            {formHeading}
            {formContent}
            {whatsappFooter}
          </div>

          {/* Contact Information - Second column */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-8">
              Let's Start Your Project
            </h3>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.action}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.title}</p>
                    <p className="text-foreground font-medium">{info.details}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="space-y-6">
              <div className="elegant-card">
                <h4 className="text-xl font-heading font-bold text-foreground mb-4">
                  Why Choose Mokha Designs?
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">20+ years of design experience</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">200+ projects completed successfully</span>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

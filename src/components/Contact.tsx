import { Phone, Mail, MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';
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
import { submitLeadToSheet } from '@/utils/leads';
import { useToast } from '@/hooks/use-toast';
import { downloadVCard } from '@/utils/generateVCard';
import { detectDeviceType, detectBrowser, getVisitorLocation } from '@/utils/detectDevice';
import { useEntryMode } from '@/hooks/useEntryMode';
import { trackDesignMySpaceClicked, trackLeadValidationFailed } from '@/utils/analytics';
import { validatePhone, normalizePhone, shouldShowValidation } from '@/utils/phoneValidation';
import { validateFullName } from '@/utils/nameValidation';
import { validateEmail } from '@/utils/emailValidation';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const BUDGET_OPTIONS = [
  { value: 'up-to-30-lakhs', label: 'Up to 30 Lakhs' },
  { value: '30-50-lakhs', label: '30 - 50 Lakhs' },
  { value: '50-lakhs-1-crore', label: '50 Lakhs - 1 Crore' },
  { value: '1-crore-plus', label: '1 Crore+' },
];

const budgetLabel = (value: string) => BUDGET_OPTIONS.find((b) => b.value === value)?.label ?? '';

interface ContactProps {
  embedded?: boolean;
}

const Contact = ({ embedded = false }: ContactProps) => {
  const [honeypot, setHoneypot] = useState('');
  const [projectType, setProjectType] = useState('');
  const [apartmentSize, setApartmentSize] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [interiorsBudget, setInteriorsBudget] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [consultationDate, setConsultationDate] = useState<Date>();
  const [propertyLocation, setPropertyLocation] = useState('hyderabad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const { entryMode, setEntryMode } = useEntryMode();
  const { toast } = useToast();
  
  // Refs for scrolling to missing fields
  const locationRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

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
        scopeOfWork: '',
        finishLevel: '',
        storageRequirement: '',
        upgrades: '',
        intent: 'designer_consultation',
        estimateLow: null,
        estimateHigh: null,
        bhkSize: apartmentSize || '',
        sizeMultiplier: null,
        interiorsBudget: budgetLabel(interiorsBudget),
        website: honeypot,
      };

      console.log('Submitting form data:', submissionData);

      // Append the lead straight to the Google Sheet (Apps Script web app)
      await submitLeadToSheet(submissionData);
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

    if (projectType && !interiorsBudget) {
      toast({
        title: "Missing Information",
        description: "Please choose an interiors budget range.",
        variant: "destructive",
      });
      return;
    }
    
    trackDesignMySpaceClicked({
      entryMode: entryMode || 'direct',
      estimateWasGenerated: false,
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
      setInteriorsBudget('');
      setNextStep('');
      setConsultationDate(undefined);
      setPropertyLocation('');
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

  const formHeading = (
    <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
      Request a Design Call
    </h3>
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot for bots: hidden from people and screen readers */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
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

        <div ref={locationRef} className="rounded-lg">
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
          <div ref={sizeRef} className="rounded-lg p-2 -m-2">
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Residential Property Size
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
          <div ref={statusRef} className="rounded-lg p-2 -m-2">
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
              {BUDGET_OPTIONS.map((b) => (
                <div key={b.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={b.value} id={`budget-${b.value}`} />
                  <Label htmlFor={`budget-${b.value}`}>{b.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Next Step Preference */}
      {projectType && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              How would you like to proceed?
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
            Request a Design Call
          </>
        )}
      </Button>
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
        {formHeading}
        {formContent}
        {whatsappFooter}
      </div>
    );
  }

  return (
    <section id="contact" className="bg-secondary">
      <div className="container-max px-5 md:px-10 py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <p className="eyebrow">Start a project</p>
            <h2 className="section-title">Planning a home in Hyderabad?</h2>
            <p className="text-[17px] leading-relaxed text-foreground/75 max-w-[520px]">
              Tell us about the space, your timeline and your budget. Prerna takes it from there on a design call,
              and works through costs with you as the options take shape.
            </p>
            <img
              src="/images/site/balcony.jpg"
              alt="Balcony garden with red cushions overlooking green lawns"
              loading="lazy"
              className="w-full h-[260px] md:h-[340px] object-cover"
            />
            <div className="flex flex-col gap-1 text-[16px]">
              <a href="tel:+919908392200" className="text-foreground hover:text-muted-foreground">+91 99083 92200</a>
              <a href="mailto:mokhadesigns@outlook.com" className="text-foreground hover:text-muted-foreground">mokhadesigns@outlook.com</a>
              <span className="text-muted-foreground">Manikonda, Hyderabad · Mon to Fri, 9 am to 6 pm</span>
            </div>
          </div>

          <div className="elegant-card font-sans">
            {formHeading}
            {formContent}
            {whatsappFooter}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

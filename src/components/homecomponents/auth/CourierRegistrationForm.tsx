"use client";

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Schema de validation par étape
const personalSchema = z.object({
  fullName: z.string().min(3, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  dateOfBirth: z.string().min(1, "Date de naissance requise"),
});

const locationSchema = z.object({
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().min(4, "Code postal requis"),
});

const vehicleSchema = z.object({
  vehicleType: z.enum(["BIKE", "SCOOTER", "CAR", "VAN"]),
  licensePlate: z.string().optional(),
  insurancePolicy: z.string().optional(),
});

const financialSchema = z.object({
  siret: z.string().min(9, "Numéro SIRET invalide"),
  iban: z.string().min(15, "IBAN invalide"),
});

const formSchema = z.object({
  ...personalSchema.shape,
  ...locationSchema.shape,
  ...vehicleSchema.shape,
  ...financialSchema.shape,
  terms: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Identité", description: "Informations personnelles" },
  { id: 2, title: "Base Opérationnelle", description: "Adresse & Zone" },
  { id: 3, title: "Véhicule", description: "Configuration" },
  { id: 4, title: "Financier", description: "SIRET & IBAN" },
  { id: 5, title: "Documents", description: "Pièces justificatives" },
];

export default function CourierRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: "CAR",
      terms: false,
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, formState: { errors }, watch } = methods;

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const nextStep = async () => {
    let schemaToValidate;
    switch (currentStep) {
      case 1: schemaToValidate = personalSchema; break;
      case 2: schemaToValidate = locationSchema; break;
      case 3: schemaToValidate = vehicleSchema; break;
      case 4: schemaToValidate = financialSchema; break;
      default: return;
    }

    const isValid = await trigger(Object.keys(schemaToValidate.shape) as any);
    if (isValid) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = (data: FormData) => {
    console.log("✅ Formulaire complet :", data);
    alert("Onboarding protocol initiated. Review dans les 24h.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-tight">Freelance Onboarding</h1>
        <p className="text-muted-foreground mt-2">Rejoignez le réseau LOGISTRIDE</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`text-xs font-medium ${step.id < currentStep ? 'text-primary' : step.id === currentStep ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-8 md:p-10">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Personal Identity */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">01. Identité Personnelle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nom complet</Label>
                    <Input {...methods.register("fullName")} placeholder="Jean-Luc Picard" />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" {...methods.register("email")} placeholder="contact@logistride.fr" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input {...methods.register("phone")} placeholder="+33 6 12 34 56 78" />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <Label>Date de naissance</Label>
                    <Input type="date" {...methods.register("dateOfBirth")} />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">02. Base Opérationnelle</h2>
                <div className="space-y-6">
                  <div>
                    <Label>Adresse complète</Label>
                    <Input {...methods.register("address")} placeholder="17 Rue des Logisticiens" />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Ville</Label>
                      <Input {...methods.register("city")} placeholder="Paris" />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <Label>Code Postal</Label>
                      <Input {...methods.register("postalCode")} placeholder="75001" />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Vehicle */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">03. Configuration Véhicule</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Type de véhicule</Label>
                    <Select onValueChange={(v) => methods.setValue("vehicleType", v as any)} defaultValue="CAR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BIKE">Vélo</SelectItem>
                        <SelectItem value="SCOOTER">Scooter</SelectItem>
                        <SelectItem value="CAR">Voiture</SelectItem>
                        <SelectItem value="VAN">Van / Utilitaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Plaque d'immatriculation</Label>
                    <Input {...methods.register("licensePlate")} placeholder="AB-123-CD" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Numéro de police d'assurance</Label>
                    <Input {...methods.register("insurancePolicy")} placeholder="POL-99887766" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Financial */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">04. Informations Financières</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Numéro SIRET</Label>
                    <Input {...methods.register("siret")} placeholder="123 456 789 00012" />
                    {errors.siret && <p className="text-red-500 text-sm mt-1">{errors.siret.message}</p>}
                  </div>
                  <div>
                    <Label>IBAN</Label>
                    <Input {...methods.register("iban")} placeholder="FR76 1234 5678 9012 3456 7890 123" />
                    {errors.iban && <p className="text-red-500 text-sm mt-1">{errors.iban.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">05. Documents</h2>
                <p className="text-muted-foreground">Cliquez sur chaque carte pour simuler l'upload</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["ID CARD", "DRIVING LICENSE", "VEHICLE INSURANCE", "K-BIS"].map((doc, i) => (
                    <Card key={i} className="p-6 flex flex-col items-center justify-center text-center hover:border-primary cursor-pointer transition-colors">
                      <div className="text-4xl mb-3">📄</div>
                      <p className="font-medium text-sm">{doc}</p>
                      <p className="text-xs text-green-600 mt-1">✓ Attaché</p>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <Checkbox id="terms" {...methods.register("terms")} />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    Je confirme l'exactitude des informations et j'accepte les conditions d'utilisation de LOGISTRIDE.
                  </Label>
                </div>
                {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
              </div>
            )}

            <Separator />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                ← Précédent
              </Button>

              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep}>
                  Suivant →
                </Button>
              ) : (
                <Button type="submit">
                  Initialiser l'Onboarding
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
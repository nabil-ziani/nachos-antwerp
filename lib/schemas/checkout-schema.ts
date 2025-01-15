import { z } from 'zod'
import { Restaurant, DeliveryMethod, PaymentMethod } from '@/types'
import { findRestaurantByPostalCode } from '@/utils/location'

// Helper function to create a context-aware validator
const createContextValidator = (totalAmount: number, selectedRestaurant: Restaurant | null, restaurants: Restaurant[]) => {
    return z.object({
        firstName: z.string().min(1, 'Voornaam is verplicht'),
        lastName: z.string().min(1, 'Familienaam is verplicht'),
        email: z.string().min(1, 'Email is verplicht').email('Ongeldige mailadres'),
        tel: z.string().min(1, 'Telefoonnummer is verplicht'),
        company: z.string().default(''),
        vatNumber: z.string().default('')
            .superRefine((val, ctx) => {
                if ((ctx as any).parent.company && !val) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'BTW nummer is verplicht wanneer een bedrijfsnaam is ingevuld'
                    })
                }

                if (!val) return // Skip als er geen BTW nummer is
                const vatRegex = /^BE[0-9]{10}$/
                if (!vatRegex.test(val.replace(/\s/g, ''))) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Ongeldig BTW nummer formaat (bijv. BE0123456789)'
                    })
                }
            }),
        city: z.string().default('')
            .superRefine((val, ctx) => {
                if ((ctx as any).parent.deliveryMethod === DeliveryMethod.delivery && !val) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Stad is verplicht voor bezorging'
                    })
                }
            }),
        address: z.string().default('')
            .superRefine((val, ctx) => {
                if ((ctx as any).parent.deliveryMethod === DeliveryMethod.delivery && !val) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Adres is verplicht voor bezorging'
                    })
                }
            }),
        postcode: z.string().default('')
            .superRefine((val, ctx) => {
                if ((ctx as any).parent.deliveryMethod === DeliveryMethod.delivery) {
                    if (!val) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Postcode is verplicht voor bezorging'
                        })
                        return
                    }
                    if (!/^\d{4}$/.test(val)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Ongeldige postcode'
                        })
                        return
                    }
                    // Check minimum order amount
                    if (selectedRestaurant) {
                        const { minimumAmount } = findRestaurantByPostalCode(restaurants, selectedRestaurant, val)
                        if (minimumAmount && totalAmount < minimumAmount) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: `Minimum bestelbedrag voor ${val} is €${minimumAmount.toFixed(2)}`
                            })
                            return
                        }
                        // Check if restaurant delivers to this postal code
                        if (!selectedRestaurant.allowedPostalcodes?.includes(val)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: `We bezorgen niet in ${val}.`
                            })
                        }
                    }
                }
            }),
        message: z.string().default(''),
        paymentMethod: z.nativeEnum(PaymentMethod),
        deliveryMethod: z.nativeEnum(DeliveryMethod)
            .superRefine((val, ctx) => {
                if (!selectedRestaurant && val === DeliveryMethod.delivery) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Selecteer eerst een restaurant'
                    })
                }
            }),
        rememberDetails: z.boolean().default(true)
    })
}

export type CheckoutFormValues = z.infer<ReturnType<typeof createContextValidator>>

export const defaultValues: CheckoutFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    company: '',
    vatNumber: '',
    city: '',
    address: '',
    postcode: '',
    message: '',
    paymentMethod: PaymentMethod.cash,
    deliveryMethod: DeliveryMethod.pickup,
    rememberDetails: true
}

export const createCheckoutSchema = (totalAmount: number, selectedRestaurant: Restaurant | null, restaurants: Restaurant[]) => {
    return createContextValidator(totalAmount, selectedRestaurant, restaurants)
} 
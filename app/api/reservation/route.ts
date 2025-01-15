import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { reservationSchema } from '@/lib/schemas/reservation-schema'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const validatedData = reservationSchema.parse(data)

        const reservation = await prisma.reservation.create({
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                customerEmail: validatedData.customerEmail,
                phoneNumber: validatedData.phoneNumber,
                date: validatedData.date,
                time: validatedData.time,
                numberOfPeople: parseInt(validatedData.numberOfPeople),
                message: validatedData.message,
                restaurantId: process.env.RESTAURANT_ID
            }
        })

        return NextResponse.json(reservation)
    } catch (error) {
        console.error('Failed to save reservation:', error)

        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validatie error', details: error.errors },
                { status: 400 }
            )
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json(
                { error: 'Database error', code: error.code },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Er is een onverwachte fout opgetreden' },
            { status: 500 }
        )
    }
} 
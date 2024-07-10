import connect from "@/lib/db";
import Category from "@/lib/models/category.model";
import User from "@/lib/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing userId"
                }),
                {status: 400}
            );
        }
        await connect();

        const user = await User.findById(userId);

        if(!user) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found in database"
                }),
                {status: 400}
            );
        }

        const categories = await Category.find({ user: new Types.ObjectId(userId)});

        return new NextResponse(JSON.stringify(categories), {status: 200});

    } catch (error: any) {
        return new NextResponse(JSON.stringify({message: "error getting category" + error.message}), {status: 400});
    }

}
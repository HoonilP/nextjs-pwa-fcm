'use client';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function RegistrationTheme() {
    return (
        <div className="flex flex-col p-10 space-y-8 min-h-screen">
            <h1 className="text-3xl font-bold">입금 내역 등록</h1>
            <div className="flex justify-between space-x-8">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-green-800">입금 내역을 등록하세요</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-1">
                                <Label>테마</Label>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
                                            테마 선택
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Billing</DropdownMenuItem>
                                            <DropdownMenuItem>Team</DropdownMenuItem>
                                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label>학년도</Label>
                                <Input name="purchaseDate" className="w-full" type="text" required />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label>학기</Label>
                                <Input name="value" className="w-full" type="text" required />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label>금액</Label>
                                <Input name="value" className="w-full" type="text" required />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label>사진</Label>
                                <Input name="value" className="w-full" type="text" required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">확인</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

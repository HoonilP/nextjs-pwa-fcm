'use client';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RegistrationTheme() {
    return (
        <div className="flex flex-col p-10 space-y-8 min-h-screen">
            <h1 className="text-3xl font-bold">테마 등록</h1>
            <div className="grid grid-cols-1 gap-8">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-green-800">테마를 등록하세요</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-1">
                                <Label>학년도</Label>
                                <Input name="itemName" className="w-full" type="text" required />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label>학기</Label>
                                <Input name="purchaseDate" className="w-full" type="text" required />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label>테마명</Label>
                                <Input name="value" className="w-full" type="text" required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">확인</Button>
                    </CardFooter>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-green-800">테마 목록</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96 border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">학년도</TableHead>
                                        <TableHead className="text-center">학기</TableHead>
                                        <TableHead className="text-center">테마명</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-2">
                                            등록된 테마가 없습니다
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

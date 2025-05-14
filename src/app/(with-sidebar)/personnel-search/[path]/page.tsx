'use client';

// Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// React
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Types
import { personnelDataSchema } from "@/types";
import { ParamValue } from "next/dist/server/request/params";

export default function SearchAll() {
    // Path Param
    const { path } = useParams();

    // Variables
    const [personnelData, setPersonnelData] = useState<personnelDataSchema[]>([]);

    // Fetch Data
    useEffect(() => {
        fetch(`/api/getPersonnels?path=${path}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.personnelData);
                const personnelData = data.personnelData;
                setPersonnelData(personnelData);
            });
    }, []);

    // Dynamic Heading
    const getHeading = (path: ParamValue) => {
        switch (path) {
            case 'student': return '학생 조회';
            case 'committee': return '학생회 조회';
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <h1 className="text-4xl font-bold px-4 mb-4">{getHeading(path)}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personnelData.map((item, index) => (
                    <Card key={index} className="shadow-md rounded-lg p-4">
                        <CardHeader className="text-center">
                            <img src="https://www.w3schools.com/w3images/avatar1.png" alt={item.username} className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
                            <CardTitle>{item.username}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-semibold">학번:</span>
                                    <span>{item.studentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">이메일:</span>
                                    <span>{item.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
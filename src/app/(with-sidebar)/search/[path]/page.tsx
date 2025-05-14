'use client';

// Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// React
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Types
import { ledgerDataSchema } from "@/types";
import { ParamValue } from "next/dist/server/request/params";

export default function SearchAll() {
    // Path Param
    const { path } = useParams();

    // Variables
    const [ledgerData, setLedgerData] = useState<ledgerDataSchema[]>([]);

    // Fetch Data
    useEffect(() => {
        fetch(`/api/getLedgerBalance?path=${path}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.ledgerData);
                const ledgerData = data.ledgerData;
                setLedgerData(ledgerData);
            });
    }, []);

    // Dynamic Heading
    const getHeading = (path: ParamValue) => {
        switch (path) {
            case 'all': return '모든 내역 조회';
            case 'deposit': return '입금 내역 조회';
            case 'withdrawal': return '출금 내역 조회';
            case 'my': return '나의 내역 조회';
            case 'theme': return '테마별 내역 조회';
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <h1 className="text-4xl font-bold px-4 mb-4">{getHeading(path)}</h1>
            {/* <div className="space-y-4">
                {ledgerData.map((item, index) => (
                    <Card key={index} className="shadow-md">
                        <CardHeader>
                            <CardTitle>테마: {item.theme}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between">
                                <span>currentBalance: {item.currentBalance}</span>
                                <span>lastUpdated: {item.lastUpdated}</span>
                                <span>totalDeposit: {item.totalDeposit}</span>
                                <span>totalWithdraw: {item.totalWithdraw}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div> */}
        </div>
    );
}
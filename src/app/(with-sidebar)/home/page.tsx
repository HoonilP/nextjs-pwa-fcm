'use client';

// Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Context
import { useUser } from "@/context/UserProvider";

// FCM
import { issueFcmToken } from "@/utils/fcmToken";

// React
import { useEffect, useState } from "react";

// Types
import { ledgerDataSchema } from "@/types";

export default function Home() {
    // UserContext
    const { username, userRole } = useUser();

    // Variables
    const [ledgerData, setLedgerData] = useState<ledgerDataSchema[]>([]);

    // FCM Token & Init
    useEffect(() => {
        issueFcmToken(userRole);

        fetch(`/api/getLedgerBalance?path=all`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.ledgerData);
                const ledgerData = data.ledgerData;
                setLedgerData(ledgerData);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-4">
            <div>
                Home Page
            </div>
            <div>
                최근 알림
            </div>
            <div>
                승인 요청 상태(Pending, Success, Failed)
            </div>
            <div>
                <h1 className="text-4xl font-bold px-4 mb-4">장부 내역</h1>

                <div className="space-y-4">
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
                </div>
            </div>
        </div>

    );
}
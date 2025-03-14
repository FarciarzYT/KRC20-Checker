
import React from "react";
import {InfoCardProps} from "@/types/fund";


export function InfoCard({icon: Icon, value, label}: InfoCardProps) {
    return (
        <div className="bg-backcard-100 rounded-lg p-3 flex items-center">
            <div className="mr-3 text-teal-400">
             <Icon />
            </div>
            <div>
                <h3 className="text-sm text-gray-300">{label}</h3>
                <p className="font-bold text-white">{value}</p>
            </div>
        </div>
    );
}
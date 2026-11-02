import React, { useEffect, useState } from "react";

const API_URL =
    "http://localhost:5000/api/bottom-institutional-strip";

const BottomInstitutional = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchInstitutionalData = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const result = await response.json();

                console.log("BOTTOM STRIP:", result);

                if (result?.success && Array.isArray(result.data)) {
                    setItems(result.data);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error(
                    "BOTTOM INSTITUTIONAL STRIP ERROR:",
                    error
                );
                setItems([]);
            }
        };

        fetchInstitutionalData();
    }, []);

    if (!items.length) {
        return null;
    }

    return (
        <section className="w-full bg-[#f5fbca] border-y border-[#B8C9DC]">

            <div className="w-full min-h-[44px] flex items-center justify-center">

                <div className="w-full flex items-center justify-center overflow-x-auto overflow-y-hidden">

                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>

                            {/* INFORMATION ITEM */}
                            <div className="flex items-center whitespace-nowrap px-5 py-2">

                                {/* LABEL */}
                                <span className="text-[11px] font-semibold text-[#24496F] tracking-[0.1px]">
                                    {item.field_name}
                                </span>

                                {/* VALUE */}
                                <span className="ml-2 text-[11px] font-bold text-[#0F3262]">
                                    {item.field_value}
                                </span>

                            </div>

                            {/* SEPARATOR */}
                            {index !== items.length - 1 && (
                                <div className="h-5 w-px bg-[#A8BCD2] shrink-0" />
                            )}

                        </React.Fragment>
                    ))}

                </div>

            </div>

        </section>
    );
};

export default BottomInstitutional;
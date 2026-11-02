import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE}/bottom-institutional-strip`;

const BottomInstitutional = () => {
  const [institutionalData, setInstitutionalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchInstitutionalData = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted && result.success && result.data) {
          setInstitutionalData(result.data);
        }
      } catch (error) {
        console.error(
          "Bottom Institutional Strip API Error:",
          error
        );

        if (isMounted) {
          setInstitutionalData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInstitutionalData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="w-full border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex min-h-[40px] max-w-7xl items-center justify-center">
          <Loader2
            size={18}
            className="animate-spin text-[#0f3262]"
          />
        </div>
      </section>
    );
  }

  if (!institutionalData) {
    return null;
  }

  if (Number(institutionalData.is_active) !== 1) {
    return null;
  }

  /*
   * The values below come directly from the database.
   * No fieldMap is required.
   *
   * Only the display labels are defined here because
   * labels are presentation/UI text, not database data.
   */

  const items = [
    {
      label: "Established",
      value: institutionalData.established,
    },
    {
      label: "UGC Recognized",
      value: institutionalData.ugc_recognized,
    },
    {
      label: "AISHE Code",
      value: institutionalData.aishe_code,
    },
    {
      label: "2(f) / 12(B)",
      value:
        institutionalData.ugc_2f_12b ||
        institutionalData.recognition_2f_12b,
    },
    {
      label: "ISO Certified",
      value: institutionalData.iso_certified,
    },
    {
      label: "Autonomous Status",
      value: institutionalData.autonomous_status,
    },
  ].filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined &&
      String(item.value).trim() !== ""
  );

  if (!items.length) {
    return null;
  }

  return (
    <section className="w-full border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8">
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6
            divide-x
            divide-slate-200
          "
        >
          {items.map((item) => (
            <div
              key={item.label}
              className="
                group
                relative
                flex
                min-h-[72px]
                items-center
                justify-center
                px-2
                py-2.5
                text-center
                transition-colors
                duration-200
                hover:bg-white
              "
            >
              <div className="flex flex-col items-center">
                <div
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    leading-tight
                    text-[#0f3262]
                    sm:text-[10px]
                  "
                >
                  {item.label}
                </div>

                <div
                  className="
                    mt-1
                    max-w-[180px]
                    text-xs
                    font-bold
                    leading-snug
                    text-slate-700
                    sm:text-sm
                  "
                >
                  {String(item.value)}
                </div>
              </div>

              <div
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-[2px]
                  w-0
                  -translate-x-1/2
                  bg-[#d4af37]
                  transition-all
                  duration-200
                  group-hover:w-10
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BottomInstitutional;
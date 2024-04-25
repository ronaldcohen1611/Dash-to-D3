import { useEffect, useState } from 'react';
import { ComboBox } from './components/ui/combobox';
import * as d3 from 'd3';
import tips from './tips.csv'

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];



function App() {
  const [numerical_cols, setNumCols] = useState<d3.DSVParsedArray<{
    tip: number;
    total_bill: number;
    size: number;
  }> | null>(null);
  const [catagorical_cols, setCatCols] = useState<d3.DSVParsedArray<{
    sex: string,
    smoker: string,
    day: string,
    time: string,
  }> | null>(null);

  useEffect(() => { 
    const getNumericalData = async () => {
      await d3
        .csv(tips, (d: { tip: string; total_bill: string; size: string; }) => { 
          return {
            tip: parseFloat(d.tip),
            total_bill: parseFloat(d.total_bill),
            size: parseInt(d.size)
          }
        })
        .then((data) => {
          setNumCols(data);
        })
        .catch((err: any) => {
          console.error(err);
        });
    };

    const getCatagoricalData = async () => {
      await d3
        .csv(
          tips,
          (d: { sex: string; smoker: string; day: string; time: string }) => {
            return {
              sex: d.sex,
              smoker: d.smoker,
              day: d.day,
              time: d.time,
            };
          }
        )
        .then((data) => {
          setCatCols(data);
        })
        .catch((err: any) => {
          console.error(err);
        });
    };
    
    getNumericalData();
    getCatagoricalData();
  },[])

  return (
    <div className="flex w-full">
      <div className="flex justify-center w-full">
        <ComboBox items={frameworks} placeholder='Search me daddy'/>
      </div>
    </div>
  );
}

export default App;

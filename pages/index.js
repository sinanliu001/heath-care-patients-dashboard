import React, {
  useState,
  useEffect
} from "react";
import Image from "next/image";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAuthToken, getPatientData } from "./api/services";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = getAuthToken();
        await getPatientData(authToken, setPatientsList, setSelectedPatient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && patientsList.length === 0) {
    return <div>No patient data available.</div>;
  }

  return (
    <div className="flex gap-[32px] p-[20px]">
      {/* patients list */}
      <div className="flex flex-col gap-[16px] w-[367px] h-[1054px] border rounded-[16px] border-gray-500">
        {/* patients list - header */}
        <div className="flex justify-between p-[20px]">
          <span className="card-title-24pt">Patients</span>
          <button type="button">
            <Image
              src="/search_FILL0_wght300_GRAD0_opsz24/search_FILL0_wght300_GRAD0_opsz24.png"
              alt="search icon"
              width={18}
              height={18}
            />
          </button>
        </div>
        {/* patients list - body */}
        <div className="flex flex-col overflow-y-auto">
          {patientsList.map(patient => (
            <div
              key={patient.id}
              className={`flex gap-[12px] items-center cursor-pointer pl-[20px] py-[16px] ${selectedPatient && selectedPatient.name === patient.name ? 'bg-[#D8FCF7]' : ''}`}
              onClick={() => setSelectedPatient(patient)}
            >
              <Image
                src={patient.profile_picture}
                alt={`${patient.name}'s profile_picture`}
                width={48}
                height={48}
              />
              <div className="flex flex-col">
                <span className="body-emphasized-14pt">{patient.name}</span>
                <span className="body-secondary-info-14pt">{patient.gender}, {patient.age}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Diagnosis */}
      <div className="flex flex-col gap-[32px] w-[766px] h-[1054px]">
        <div className="flex flex-col gap-[20px] border rounded-[16px] border-gray-500 p-[20px] h-[673px]">
          <div className="pb-[20px]">
            <span className="card-title-24pt">Diagnosis History</span>
          </div>
          <div className="w-full h-[298px] bg-[#F4F0FE] rounded-[12px]">
            {selectedPatient && (
              <Line
                data={{
                  labels: [...selectedPatient.diagnosis_history.map(entry => `${entry.month} ${entry.year}`)].reverse(),
                  datasets: [
                    {
                      label: 'Blood Pressure',
                      data: selectedPatient.diagnosis_history.map(entry => entry.blood_pressure.diastolic.value).reverse(),
                      borderColor: '#C26EB4',
                      backgroundColor: '#F4F0FE',
                      tension: 0.4,
                    },
                    {
                      label: 'Blood Pressure',
                      data: selectedPatient.diagnosis_history.map(entry => entry.blood_pressure.systolic.value).reverse(),
                      borderColor: '#7E6CAB',
                      backgroundColor: '#F4F0FE',
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Chart.js Line Chart in Next.js',
                    },
                  },
                }}
              />
            )}
          </div>
          <div className="flex gap-[20px]">
            <div className="flex flex-col w-[228px] h-[242px] bg-[#E0F3FA] rounded-[12px] p-[16px]">
              <Image
                src="/respiratory_rate/respiratory rate.png"
                alt="blood pressure illustration"
                width={96}
                height={96}
              />
              <span className="body-emphasized-14pt">Respiratory Rate</span>
              <span className="body-emphasized-14pt"> bpm</span>
            </div>
            <div className="flex flex-col w-[228px] h-[242px] bg-[#FFE6E9] rounded-[12px] p-[16px]">
              <Image
                src="/temperature/temperature.png"
                alt="temperature illustration"
                width={96}
                height={96}
              />
              <span className="body-emphasized-14pt">Temperature</span>
              <span className="body-emphasized-14pt"> °C</span>
            </div>
            <div className="flex flex-col w-[228px] h-[242px] bg-[#FFE6F1] rounded-[12px] p-[16px]">
              <Image
                src="/HeartBPM/HeartBPM.png"
                alt="HeartBPM"
                width={96}
                height={96}
              />
              <span className="body-emphasized-14pt">Heart Rate</span>
              <span className="body-emphasized-14pt"> bpm</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[20px] border rounded-[16px] border-gray-500 p-[20px] h-[349px]">
          <div className="pb-[20px]">
            <span className="card-title-24pt">Diagnosis List</span>
          </div>
          <table className="table-auto overflow-y-auto">
            <thead>
              <tr className="rounded-[12px] bg-[#F6F7F8]">
                <th className="px-4 py-2">Problem/Diagnosis</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="">
              {selectedPatient && selectedPatient.diagnostic_list.map((entry, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{entry.description}</td>
                  <td className="px-4 py-2">{entry.name}</td>
                  <td className="px-4 py-2">{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* patient information */}
      <div className="flex flex-col gap-[32px] w-[367px] h-[1054px]">
        <div className="flex flex-col gap-[24px] border rounded-[16px] border-gray-500 p-[20px] w-[367px] h-[740px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Image
              src={selectedPatient?.profile_picture}
              alt={`${selectedPatient?.name}'s profile_picture`}
              width={200}
              height={200}
            />
            <span className="card-title-24pt">{selectedPatient.name}</span>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[16px] items-center">
              <Image
                src="/BirthIcon/BirthIcon.png"
                alt="Birth Icon"
                width={42}
                height={42}
              />
              <div className="flex flex-col gap-[4px]">
                <span className="body-secondary-info-14pt">Date of Birth</span>
                <span className="body-emphasized-14pt">{selectedPatient?.date_of_birth}</span>
              </div>
            </div>
            <div className="flex gap-[16px] items-center">
              {
                selectedPatient?.gender === 'male' ? (
                  <Image
                    src="/MaleIcon/MaleIcon.png"
                    alt="Male Icon"
                    width={42}
                    height={42}
                  />
                ) : (
                  <Image
                    src="/FemaleIcon/FemaleIcon.png"
                    alt="Female Icon"
                    width={42}
                    height={42}
                  />
                )
              }
              <div className="flex flex-col gap-[4px]">
                <span className="body-secondary-info-14pt">Gender</span>
                <span className="body-emphasized-14pt">{selectedPatient?.gender}</span>
              </div>
            </div>
            <div className="flex gap-[16px] items-center">
              <Image
                src="/PhoneIcon/PhoneIcon.png"
                alt="Phone Icon"
                width={42}
                height={42}
              />
              <div className="flex flex-col gap-[4px]">
                <span className="body-secondary-info-14pt">Contact Info.</span>
                <span className="body-emphasized-14pt">{selectedPatient?.phone_number}</span>
              </div>
            </div>
            <div className="flex gap-[16px] items-center">
              <Image
                src="/PhoneIcon/PhoneIcon.png"
                alt="Phone Icon"
                width={42}
                height={42}
              />
              <div className="flex flex-col gap-[4px]">
                <span className="body-secondary-info-14pt">Emergency Contacts</span>
                <span className="body-emphasized-14pt">{selectedPatient?.emergency_contact}</span>
              </div>
            </div>
            <div className="flex gap-[16px] items-center">
              <Image
                src="/InsuranceIcon/InsuranceIcon.png"
                alt="Insurance Icon"
                width={42}
                height={42}
              />
              <div className="flex flex-col gap-[4px]">
                <span className="body-secondary-info-14pt">Insurance Provider</span>
                <span className="body-emphasized-14pt">{selectedPatient?.insurance_type}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-[20px] border rounded-[16px] border-gray-500 w-[367px] h-[296px]">
          <span className="card-title-24pt">Lab Results</span>
          <div className="flex flex-col gap-[12px] overflow-y-auto">
            {
              selectedPatient && selectedPatient.lab_results.length > 0 ? selectedPatient.lab_results.map((entry, index) => (
                <div key={index} className="flex gap-[12px] mt-[20px] items-center justify-between">
                  <span className="body-emphasized-14pt">{entry}</span>
                  <Image
                    src="/download_FILL0_wght300_GRAD0_opsz24/download_FILL0_wght300_GRAD0_opsz24.png"
                    alt="download icon"
                    width={24}
                    height={24}
                    className="mr-[20px] cursor-pointer"
                  />
                </div>
              )) : <span className="body-secondary-info-14pt mt-[20px]">No lab results available.</span>

            }
          </div>
        </div>
      </div>
    </div >
  );
}

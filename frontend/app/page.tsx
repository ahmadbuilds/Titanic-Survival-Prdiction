'use client'
import React, { useState, useEffect } from 'react';

interface FormData {
  Pclass: string,
  Sex: string,
  Age: string,
  Fare: string,
  Embarked: string,
  FamilySize: string,
  isAlone: boolean,
  Title: string,
  TicketPrefix: string,
  CabinLetter: string
}

interface PredictionResponse {
  "Logistic Regression Prediction": number,
  "Random Forest Prediction": number,
  "Ensemble Model Prediction": number
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    Pclass: '',
    Sex: '',
    Age: '',
    Fare: '',
    Embarked: '',
    FamilySize: '',
    isAlone: false,
    Title: '',
    TicketPrefix: '',
    CabinLetter: ''
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const Titles = [
    'Mr', 'Mrs', 'Miss', 'Master', 'Dr', 'Rev', 'Col', 'Major', 'Capt',
    'Countess', 'Don', 'Dona', 'Jonkheer', 'Lady', 'Mlle', 'Mme', 'Ms', 'Sir'
  ];

  const TicketPrefix = [
    'PC', 'STON/O2', 'A/5', 'C.A.', 'S.O.C.', 'A/4', 'W./C.', 'SOTON/O.Q.',
    'A./5.', 'C', 'CA', 'F.C.C.', 'SC/PARIS', 'SO/C', 'W.E.P.', 'A/S',
    'S.W./PP', 'S.C./PARIS', 'C.A./SOTON', 'SC/AH', 'LINE'
  ];

  const cabinLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'T'];

  const validateForm = () => {
    const newErrors = {} as Record<keyof FormData, string>;
    
    if (!formData.Pclass) {
      newErrors.Pclass = 'Please select a passenger class';
    } else if (formData.Pclass === '0') {
      newErrors.Pclass = 'Passenger class cannot be 0';
    }
    
    if (!formData.Sex) {
      newErrors.Sex = 'Please select gender';
    }
    
    if (!formData.Age) {
      newErrors.Age = 'Age is required';
    } else if (parseFloat(formData.Age) <= 0) {
      newErrors.Age = 'Age must be greater than 0';
    }
    
    if (!formData.Fare) {
      newErrors.Fare = 'Fare is required';
    } else if (parseFloat(formData.Fare) < 0) {
      newErrors.Fare = 'Fare cannot be negative';
    }
    
    if (!formData.Embarked) {
      newErrors.Embarked = 'Please select embarkation port';
    }
    
    if (!formData.FamilySize) {
      newErrors.FamilySize = 'Family size is required';
    } else if (parseInt(formData.FamilySize) < 1) {
      newErrors.FamilySize = 'Family size must be at least 1';
    }
    
    if (!formData.Title) {
      newErrors.Title = 'Please select a Title';
    }
    
    if (!formData.TicketPrefix) {
      newErrors.TicketPrefix = 'Please select a ticket prefix';
    }
    
    if (!formData.CabinLetter) {
      newErrors.CabinLetter = 'Please select a cabin letter';
    }

    return newErrors;
  };

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'FamilySize') {
        const size = parseInt(value as string, 10);
        if (size === 1) newData.isAlone = true;
        else if (size > 1) newData.isAlone = false;
      } 
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async() => {
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setIsSubmitted(false); 
      setPrediction(null); 

      try {
        const start = Date.now();
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/Prediction',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          }
        ).then(res => res.json());

        
        const elapsed = Date.now() - start;
        if (elapsed < 2000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
        }

        setPrediction(response);
        setIsSubmitted(true);
      } catch (error) {
        console.error('Prediction error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 transition-all duration-[3000ms] ${isLoaded ? 'animate-pulse scale-110' : 'scale-0'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 transition-all duration-[3000ms] delay-500 ${isLoaded ? 'animate-pulse scale-110' : 'scale-0'}`}></div>
        <div className={`absolute top-40 left-1/2 w-60 h-60 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 transition-all duration-[3000ms] delay-1000 ${isLoaded ? 'animate-pulse scale-110' : 'scale-0'}`}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white rounded-full opacity-30 transition-all duration-[4000ms] ${isLoaded ? 'animate-bounce' : 'opacity-0'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🚢 Titanic Survival Prediction
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Enter passenger details to predict survival probability on the RMS Titanic
          </p>
        </div>

        {/* Form */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Passenger Class */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Passenger Class *
                </label>
                <select
                  value={formData.Pclass}
                  title='pClass'
                  onChange={(e) => handleInputChange('Pclass', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.Pclass ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Class</option>
                  <option value="1" className="bg-gray-800">First Class</option>
                  <option value="2" className="bg-gray-800">Second Class</option>
                  <option value="3" className="bg-gray-800">Third Class</option>
                </select>
                {errors.Pclass && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.Pclass}</p>
                )}
              </div>

              {/* Gender */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Gender *
                </label>
                <select
                  value={formData.Sex}
                  title='Sex'
                  onChange={(e) => handleInputChange('Sex', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.Sex ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Gender</option>
                  <option value="male" className="bg-gray-800">Male</option>
                  <option value="female" className="bg-gray-800">Female</option>
                </select>
                {errors.Sex && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.Sex}</p>
                )}
              </div>

              {/* Age */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Age *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.Age}
                  onChange={(e) => handleInputChange('Age', e.target.value)}
                  placeholder="Enter Age"
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.Age ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                />
                {errors.Age && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.Age}</p>
                )}
              </div>

              {/* Fare */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Fare (£) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.Fare}
                  onChange={(e) => handleInputChange('Fare', e.target.value)}
                  placeholder="Enter Fare amount"
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.Fare ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                />
                {errors.Fare && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.Fare}</p>
                )}
              </div>

              {/* Embarked */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Embarkation Port *
                </label>
                <select
                  value={formData.Embarked}
                  title='Embarked'
                  onChange={(e) => handleInputChange('Embarked', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.Embarked ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Port</option>
                  <option value="C" className="bg-gray-800">Cherbourg (C)</option>
                  <option value="Q" className="bg-gray-800">Queenstown (Q)</option>
                  <option value="S" className="bg-gray-800">Southampton (S)</option>
                </select>
                {errors.Embarked && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.Embarked}</p>
                )}
              </div>

              {/* Family Size */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Family Size *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.FamilySize}
                  onChange={(e) => handleInputChange('FamilySize', e.target.value)}
                  placeholder="Total family members"
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.FamilySize ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                />
                {errors.FamilySize && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.FamilySize}</p>
                )}
              </div>

              {/* Is Alone */}
              <div className="group flex items-center pt-8">
                <label className="flex items-center cursor-pointer group-hover:scale-105 transition-transform">
                  <input
                    type="checkbox"
                    checked={formData.isAlone}
                    onChange={(e) => handleInputChange('isAlone', e.target.checked)}
                    className="w-5 h-5 text-cyan-400 rounded focus:ring-2 focus:ring-cyan-400 bg-white/10 border-white/30"
                    disabled={parseInt(formData.FamilySize, 10) >= 2}
                  />
                  <span className="ml-3 text-gray-200 font-semibold">
                    Traveling Alone {parseInt(formData.FamilySize) === 1 && '(Auto-set)'}
                  </span>
                </label>
              </div>

              {/* Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Title *
                </label>
                <select
                  value={formData.Title}
                  title='Title'
                  onChange={(e) => handleInputChange('Title', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.Title ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Title</option>
                  {Titles.map(Title => (
                    <option key={Title} value={Title} className="bg-gray-800">{Title}</option>
                  ))}
                </select>
                {errors.Title && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.Title}</p>
                )}
              </div>

              {/* Ticket Prefix */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Ticket Prefix *
                </label>
                <select
                  title='Ticket Prefix'
                  value={formData.TicketPrefix}
                  onChange={(e) => handleInputChange('TicketPrefix', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.TicketPrefix ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Prefix</option>
                  {TicketPrefix.map(prefix => (
                    <option key={prefix} value={prefix} className="bg-gray-800">{prefix}</option>
                  ))}
                </select>
                {errors.TicketPrefix && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.TicketPrefix}</p>
                )}
              </div>

              {/* Cabin Letter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Cabin Letter *
                </label>
                <select
                  value={formData.CabinLetter}
                  title='Cabin Letter'
                  onChange={(e) => handleInputChange('CabinLetter', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.CabinLetter ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Deck</option>
                  {cabinLetters.map(letter => (
                    <option key={letter} value={letter} className="bg-gray-800">
                      Deck {letter} {letter === 'A' ? '(Upper)' : letter === 'G' ? '(Lower)' : ''}
                    </option>
                  ))}
                </select>
                {errors.CabinLetter && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.CabinLetter}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 flex items-center justify-center mx-auto min-w-[250px] ${
                  isLoading 
                    ? 'opacity-75 cursor-not-allowed scale-95' 
                    : 'hover:scale-105 hover:from-cyan-400 hover:to-blue-400'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    🔮 Predict Survival
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {isSubmitted && prediction && !isLoading && (
            <div className="mt-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30 animate-fadeIn">
              <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">
                ✅ Prediction Complete!
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">{prediction["Logistic Regression Prediction"]}</div>
                  <div className="text-gray-300">Logistic Regression</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{prediction["Random Forest Prediction"]}</div>
                  <div className="text-gray-300">Random Forest</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">{prediction["Ensemble Model Prediction"]}</div>
                  <div className="text-gray-300">XGBoost</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
'use client'
import React, { useState, useEffect } from 'react';

interface FormData {
  pclass: string,
  sex: string,
  age: string,
  fare: string,
  embarked: string,
  familySize: string,
  isAlone: boolean,
  title: string,
  ticketPrefix: string,
  cabinLetter: string
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    pclass: '',
    sex: '',
    age: '',
    fare: '',
    embarked: '',
    familySize: '',
    isAlone: false,
    title: '',
    ticketPrefix: '',
    cabinLetter: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const titles = [
    'Mr', 'Mrs', 'Miss', 'Master', 'Dr', 'Rev', 'Col', 'Major', 'Capt',
    'Countess', 'Don', 'Dona', 'Jonkheer', 'Lady', 'Mlle', 'Mme', 'Ms', 'Sir'
  ];

  const ticketPrefixes = [
    'PC', 'STON/O2', 'A/5', 'C.A.', 'S.O.C.', 'A/4', 'W./C.', 'SOTON/O.Q.',
    'A./5.', 'C', 'CA', 'F.C.C.', 'SC/PARIS', 'SO/C', 'W.E.P.', 'A/S',
    'S.W./PP', 'S.C./PARIS', 'C.A./SOTON', 'SC/AH', 'LINE'
  ];

  const cabinLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'T'];

  const validateForm = () => {
    const newErrors = {} as Record<keyof FormData, string>;
    
    if (!formData.pclass) {
      newErrors.pclass = 'Please select a passenger class';
    } else if (formData.pclass === '0') {
      newErrors.pclass = 'Passenger class cannot be 0';
    }
    
    if (!formData.sex) {
      newErrors.sex = 'Please select gender';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseFloat(formData.age) <= 0) {
      newErrors.age = 'Age must be greater than 0';
    }
    
    if (!formData.fare) {
      newErrors.fare = 'Fare is required';
    } else if (parseFloat(formData.fare) < 0) {
      newErrors.fare = 'Fare cannot be negative';
    }
    
    if (!formData.embarked) {
      newErrors.embarked = 'Please select embarkation port';
    }
    
    if (!formData.familySize) {
      newErrors.familySize = 'Family size is required';
    } else if (parseInt(formData.familySize) < 1) {
      newErrors.familySize = 'Family size must be at least 1';
    }
    
    if (!formData.title) {
      newErrors.title = 'Please select a title';
    }
    
    if (!formData.ticketPrefix) {
      newErrors.ticketPrefix = 'Please select a ticket prefix';
    }
    
    if (!formData.cabinLetter) {
      newErrors.cabinLetter = 'Please select a cabin letter';
    }

    return newErrors;
  };

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-set isAlone if familySize is 1
      if (field === 'familySize') {
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

  const handleSubmit = () => {
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      // Here you would typically send data to your prediction model
      console.log('Form submitted:', formData);
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
                  value={formData.pclass}
                  title='P Class'
                  onChange={(e) => handleInputChange('pclass', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.pclass ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Class</option>
                  <option value="1" className="bg-gray-800">First Class</option>
                  <option value="2" className="bg-gray-800">Second Class</option>
                  <option value="3" className="bg-gray-800">Third Class</option>
                </select>
                {errors.pclass && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.pclass}</p>
                )}
              </div>

              {/* Gender */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Gender *
                </label>
                <select
                  value={formData.sex}
                  title='Sex'
                  onChange={(e) => handleInputChange('sex', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.sex ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Gender</option>
                  <option value="male" className="bg-gray-800">Male</option>
                  <option value="female" className="bg-gray-800">Female</option>
                </select>
                {errors.sex && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.sex}</p>
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
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter age"
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.age ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                />
                {errors.age && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.age}</p>
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
                  value={formData.fare}
                  onChange={(e) => handleInputChange('fare', e.target.value)}
                  placeholder="Enter fare amount"
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.fare ? 'border-red-400 animate-shake' : 'border-red-400'}`}
                />
                {errors.fare && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.fare}</p>
                )}
              </div>

              {/* Embarked */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Embarkation Port *
                </label>
                <select
                  value={formData.embarked}
                  title='Embarked'
                  onChange={(e) => handleInputChange('embarked', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.embarked ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Port</option>
                  <option value="C" className="bg-gray-800">Cherbourg (C)</option>
                  <option value="Q" className="bg-gray-800">Queenstown (Q)</option>
                  <option value="S" className="bg-gray-800">Southampton (S)</option>
                </select>
                {errors.embarked && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.embarked}</p>
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
                  value={formData.familySize}
                  onChange={(e) => handleInputChange('familySize', e.target.value)}
                  placeholder="Total family members"
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.familySize ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                />
                {errors.familySize && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.familySize}</p>
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
                    disabled={parseInt(formData.familySize, 10) >= 2}
                  />
                  <span className="ml-3 text-gray-200 font-semibold">
                    Traveling Alone {parseInt(formData.familySize) === 1 && '(Auto-set)'}
                  </span>
                </label>
              </div>

              {/* Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Title *
                </label>
                <select
                  value={formData.title}
                  title='Title'
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.title ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Title</option>
                  {titles.map(title => (
                    <option key={title} value={title} className="bg-gray-800">{title}</option>
                  ))}
                </select>
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.title}</p>
                )}
              </div>

              {/* Ticket Prefix */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Ticket Prefix *
                </label>
                <select
                  title='Ticket Prefix'
                  value={formData.ticketPrefix}
                  onChange={(e) => handleInputChange('ticketPrefix', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.ticketPrefix ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Prefix</option>
                  {ticketPrefixes.map(prefix => (
                    <option key={prefix} value={prefix} className="bg-gray-800">{prefix}</option>
                  ))}
                </select>
                {errors.ticketPrefix && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.ticketPrefix}</p>
                )}
              </div>

              {/* Cabin Letter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  Cabin Letter *
                </label>
                <select
                  value={formData.cabinLetter}
                  title='Cabin Letter'
                  onChange={(e) => handleInputChange('cabinLetter', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm hover:bg-white/20 ${errors.cabinLetter ? 'border-red-400 animate-shake' : 'border-white/30'}`}
                >
                  <option value="" className="bg-gray-800">Select Deck</option>
                  {cabinLetters.map(letter => (
                    <option key={letter} value={letter} className="bg-gray-800">
                      Deck {letter} {letter === 'A' ? '(Upper)' : letter === 'G' ? '(Lower)' : ''}
                    </option>
                  ))}
                </select>
                {errors.cabinLetter && (
                  <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.cabinLetter}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-cyan-400 hover:to-blue-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
              >
                🔮 Predict Survival
              </button>
            </div>
          </div>

          {/* Results */}
          {isSubmitted && (
            <div className="mt-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30 animate-fadeIn">
              <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">
                ✅ Prediction Complete!
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">85%</div>
                  <div className="text-gray-300">Survival Probability</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{formData.pclass}</div>
                  <div className="text-gray-300">Class</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">{formData.age}</div>
                  <div className="text-gray-300">Age</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-pink-400">£{formData.fare}</div>
                  <div className="text-gray-300">Fare</div>
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
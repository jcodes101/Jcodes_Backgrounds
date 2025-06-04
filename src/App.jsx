import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import JcodesHomepage from "./components/JcodesHomepage";

import FireflyMagicBg from "./components/FireFlyMagic/FireflyMagic_BG";
import FireFlyMagicBGSourceCodeDisplay from "./components/FireFlyMagic/FireFlyMagicBGSourceCodeDisplay";

import NeuralNetworkBG from "./components/NeuralNetwork/NeuralNetwork_BG";
import NeuralNetworkBGSourceCodeDisplay from "./components/NeuralNetwork/NeuralNetworkBGSourceCodeDisplay";

import CodeTypingBG from "./components/CodeTyping/CodeTyping_BG";
import CodeTypingBGSourceCodeDisplay from "./components/CodeTyping/CodeTypingBGSourceCodeDisplay";

import GeometricWavesBG from "./components/GeometricWaves/GeometricWaves_BG";
import GeometricWavesBGSourceCodeDisplay from "./components/GeometricWaves/GeometricWavesBGSourceCodeDisplay";

import StarfieldJourneyBG from "./components/StarfieldJourney/StarfieldJourney_BG";
import StarfieldJourneyBGSourceCodeDisplay from "./components/StarfieldJourney/StarfieldJourneyBGSourceCodeDisplay";

import FloatingBubblesBG from "./components/FloatingBubbles/FloatingBubbles_BG";
import FloatingBubblesBGSourceCodeDisplay from "./components/FloatingBubbles/FloatingBubblesBGSourceCodeDisplay";

import MatrixRainBG from "./components/MatrixRain/MatrixRain_BG";
import MatrixRainBGSourceCodeDisplay from "./components/MatrixRain/MatrixRainBGSourceCodeDisplay";

import AuroraWaves from "./components/AuroraWaves/AuroraWaves_BG";
import AuroraWavesSourceCodeDisplay from "./components/AuroraWaves/AuroraWavesBGSourceCodeDisplay";

function App() {

  return (

    <>
      <Router>
        <Routes>

          <Route path='/' element={<JcodesHomepage />} />

          <Route path='/firefly-magic-bg' element={<FireflyMagicBg />} />
          <Route path='/neural-network-bg' element={<NeuralNetworkBG />} />
          <Route path='/code-typing-bg' element={<CodeTypingBG />} />
          <Route path='/geometric-waves-bg' element={<GeometricWavesBG />} />
          <Route path='/starfield-journey-bg' element={<StarfieldJourneyBG />} />
          <Route path='/floating-bubbles-bg' element={<FloatingBubblesBG />} />
          <Route path='/matrix-rain-bg' element={<MatrixRainBG />} />
          <Route path='/aurora-waves-bg' element={<AuroraWaves />} />

          <Route path='/firefly-magic-sc' element={<FireFlyMagicBGSourceCodeDisplay />} />
          <Route path='/neural-network-sc' element={<NeuralNetworkBGSourceCodeDisplay />} />
          <Route path='/code-typing-sc' element={<CodeTypingBGSourceCodeDisplay />} />
          <Route path='/geometric-waves-sc' element={<GeometricWavesBGSourceCodeDisplay />} />
          <Route path='/starfield-journey-sc' element={<StarfieldJourneyBGSourceCodeDisplay />} />
          <Route path='/floating-bubbles-sc' element={<FloatingBubblesBGSourceCodeDisplay />} />
          <Route path='/matrix-rain-sc' element={<MatrixRainBGSourceCodeDisplay />} />
          <Route path='/aurora-waves-sc' element={<AuroraWavesSourceCodeDisplay />} />

        </Routes>
      </Router>
    </>
  )
}

export default App;
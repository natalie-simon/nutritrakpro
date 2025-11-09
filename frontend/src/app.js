// ============================================
// GLOBAL VARIABLES & INITIALIZATION
// ============================================

// Clés API codées en dur
const CLARIFAI_API_KEY = '5d6ee14430e642408cc08bd89c64dd28';
const USDA_API_KEY = 'PS2HqdAYDA7GatNE6wqMdfTvbvJOTG3Ars876FrD';

let html5QrCode = null;
let isScanning = false;
let caloriesChart = null;
let currentPhotoBase64 = null;

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadSettings();
    loadHistory();
    updateDailySummary();
    updateGoalProgress();
    initializeCaloriesChart();
    updateAPIStatus();
    loadDarkMode();
    setupDragAndDrop();
    checkHTTPS();
}

// Vérifier si on est en HTTPS
function checkHTTPS() {
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (!isSecureContext) {
        // Afficher l'avertissement
        const warning = document.getElementById('https-warning');
        if (warning) {
            warning.classList.remove('hidden');
        }

        // Désactiver le bouton de scan caméra
        const scanBtn = document.getElementById('start-scan-btn');
        if (scanBtn) {
            scanBtn.disabled = true;
            scanBtn.classList.add('opacity-50', 'cursor-not-allowed');
            scanBtn.classList.remove('hover:bg-blue-700');
        }
    }
}

// ============================================
// SETTINGS & LOCAL STORAGE MANAGEMENT
// ============================================

function loadSettings() {
    // Afficher la clé Clarifai codée en dur
    if (CLARIFAI_API_KEY) {
        document.getElementById('clarifai-key').value = CLARIFAI_API_KEY;
        console.log('✅ Clé Clarifai codée en dur active:', CLARIFAI_API_KEY.substring(0, 8) + '...');
    }

    // Afficher la clé USDA codée en dur
    if (USDA_API_KEY) {
        document.getElementById('usda-key').value = USDA_API_KEY;
        console.log('✅ Clé USDA codée en dur active:', USDA_API_KEY.substring(0, 8) + '...');
    }

    // Load calorie goal
    const goal = localStorage.getItem('calorieGoal') || '2000';
    document.getElementById('calorie-goal-input').value = goal;
    document.getElementById('current-goal').textContent = goal;
    document.getElementById('calories-goal').textContent = goal;

    // Update Clarifai usage counter
    const usage = localStorage.getItem('clarifaiUsage') || '0';
    document.getElementById('clarifai-usage').textContent = usage;
}

function saveClarifaiKey() {
    const key = document.getElementById('clarifai-key').value.trim();
    if (key) {
        localStorage.setItem('clarifaiKey', key);
        showSuccess('Clé API Clarifai enregistrée');
        updateAPIStatus();
    } else {
        showError('Veuillez entrer une clé API valide');
    }
}

function saveUSDAKey() {
    const key = document.getElementById('usda-key').value.trim();
    if (key) {
        localStorage.setItem('usdaKey', key);
        showSuccess('Clé API USDA enregistrée');
        updateAPIStatus();
    } else {
        showError('Veuillez entrer une clé API valide');
    }
}

function saveCalorieGoal() {
    const goal = document.getElementById('calorie-goal-input').value;
    if (goal && goal > 0) {
        localStorage.setItem('calorieGoal', goal);
        document.getElementById('current-goal').textContent = goal;
        document.getElementById('calories-goal').textContent = goal;
        updateGoalProgress();
        showSuccess('Objectif calorique mis à jour');
    } else {
        showError('Veuillez entrer un objectif valide');
    }
}

function updateAPIStatus() {
    // Update Photo tab status - Clarifai est codée en dur
    const apiStatusText = document.getElementById('api-status-text');
    if (CLARIFAI_API_KEY) {
        apiStatusText.textContent = 'Configurée ✅ (en dur)';
        apiStatusText.className = 'text-green-600 font-semibold';
    } else {
        apiStatusText.textContent = 'Non configurée ❌';
        apiStatusText.className = 'text-red-600 font-semibold';
    }

    // Update Settings status
    const clarifaiStatusText = document.getElementById('clarifai-status-text');
    const usdaStatusText = document.getElementById('usda-status-text');

    // Clarifai est toujours configurée en dur
    if (CLARIFAI_API_KEY) {
        clarifaiStatusText.textContent = '✅ Configurée (en dur)';
        clarifaiStatusText.className = 'font-semibold text-green-600';
    } else {
        clarifaiStatusText.textContent = '❌ Non configurée';
        clarifaiStatusText.className = 'font-semibold text-red-600';
    }

    // USDA est aussi configurée en dur
    if (USDA_API_KEY) {
        usdaStatusText.textContent = '✅ Configurée (en dur)';
        usdaStatusText.className = 'font-semibold text-green-600';
    } else {
        usdaStatusText.textContent = '❌ Non configurée';
        usdaStatusText.className = 'font-semibold text-red-600';
    }
}

function clearAllData() {
    if (confirm('⚠️ ATTENTION : Cette action va effacer TOUTES vos données (historique, paramètres, clés API). Continuer ?')) {
        localStorage.clear();
        showSuccess('Toutes les données ont été effacées');
        setTimeout(() => location.reload(), 1500);
    }
}

// ============================================
// DARK MODE
// ============================================

function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark');
        document.getElementById('theme-icon').textContent = '☀️';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
}

// ============================================
// TAB NAVIGATION
// ============================================

function switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });

    // Reset all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-green-600', 'border-b-2', 'border-green-600');
        btn.classList.add('text-gray-500');
    });

    // Show selected section
    document.getElementById(`section-${tabName}`).classList.remove('hidden');

    // Highlight selected tab
    const activeTab = document.getElementById(`tab-${tabName}`);
    activeTab.classList.remove('text-gray-500');
    activeTab.classList.add('text-green-600', 'border-b-2', 'border-green-600');

    // Special actions per tab
    if (tabName === 'history') {
        loadHistory();
        updateDailySummary();
        updateGoalProgress();
        updateCaloriesChart();
    } else if (tabName === 'settings') {
        loadSettings();
    }
}

// ============================================
// BARCODE SCANNER (Open Food Facts)
// ============================================

function startScanner() {
    // Vérifier si on est en HTTPS ou localhost
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (!isSecureContext) {
        showError("⚠️ La caméra nécessite HTTPS. Utilisez la saisie manuelle du code-barre ci-dessous.");
        return;
    }

    const reader = document.getElementById('reader');
    reader.classList.remove('hidden');

    document.getElementById('start-scan-btn').classList.add('hidden');
    document.getElementById('stop-scan-btn').classList.remove('hidden');

    html5QrCode = new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
    ).catch(err => {
        let errorMessage = "⚠️ Erreur d'accès à la caméra. ";

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage += "Vous devez autoriser l'accès à la caméra dans les paramètres de votre navigateur.";
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage += "Aucune caméra détectée sur cet appareil.";
        } else if (err.name === 'NotSupportedError') {
            errorMessage += "Votre navigateur ne supporte pas cette fonctionnalité.";
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMessage += "La caméra est peut-être utilisée par une autre application.";
        } else {
            errorMessage += "Utilisez la saisie manuelle ci-dessous.";
        }

        showError(errorMessage);
        console.error('Erreur caméra:', err);
        stopScanner();
    });

    isScanning = true;
}

function stopScanner() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            document.getElementById('reader').classList.add('hidden');
            document.getElementById('start-scan-btn').classList.remove('hidden');
            document.getElementById('stop-scan-btn').classList.add('hidden');
            isScanning = false;
        }).catch(err => {
            console.error(err);
        });
    }
}

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code détecté: ${decodedText}`);
    stopScanner();
    searchProduct(decodedText);
}

function onScanError(error) {
    // Silent - scanning errors are normal
}

function searchManualBarcode() {
    const barcode = document.getElementById('manual-barcode').value.trim();

    if (!barcode) {
        showError("Veuillez entrer un code-barre");
        return;
    }

    if (!/^\d+$/.test(barcode)) {
        showError("Le code-barre doit contenir uniquement des chiffres");
        return;
    }

    searchProduct(barcode);
}

async function searchProduct(barcode) {
    const resultsDiv = document.getElementById('scanner-results');
    resultsDiv.innerHTML = `
        <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p class="text-gray-600 mt-4">Recherche du produit...</p>
        </div>
    `;
    resultsDiv.classList.remove('hidden');

    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1 && data.product) {
            displayProductInfo(data.product, barcode);
        } else {
            showError(`Produit non trouvé pour le code-barre: ${barcode}`);
            resultsDiv.classList.add('hidden');
        }
    } catch (error) {
        showError("Erreur lors de la recherche du produit. Vérifiez votre connexion internet.");
        console.error(error);
        resultsDiv.classList.add('hidden');
    }
}

function displayProductInfo(product, barcode) {
    const resultsDiv = document.getElementById('scanner-results');

    // Extract nutritional data
    const nutrients = product.nutriments || {};
    const name = product.product_name || 'Produit sans nom';
    const brands = product.brands || 'Marque inconnue';
    const imageUrl = product.image_url || '';
    const nutriScore = product.nutriscore_grade ? product.nutriscore_grade.toUpperCase() : 'N/A';

    // Nutritional values per 100g
    const calories = Math.round(nutrients['energy-kcal_100g'] || nutrients['energy-kcal'] || 0);
    const proteins = parseFloat((nutrients['proteins_100g'] || nutrients['proteins'] || 0).toFixed(1));
    const carbs = parseFloat((nutrients['carbohydrates_100g'] || nutrients['carbohydrates'] || 0).toFixed(1));
    const fats = parseFloat((nutrients['fat_100g'] || nutrients['fat'] || 0).toFixed(1));
    const sugars = parseFloat((nutrients['sugars_100g'] || nutrients['sugars'] || 0).toFixed(1));
    const fiber = parseFloat((nutrients['fiber_100g'] || nutrients['fiber'] || 0).toFixed(1));
    const salt = parseFloat((nutrients['salt_100g'] || nutrients['salt'] || 0).toFixed(1));

    // Nutri-Score color
    const nutriScoreColors = {
        'A': 'bg-green-500',
        'B': 'bg-lime-500',
        'C': 'bg-yellow-500',
        'D': 'bg-orange-500',
        'E': 'bg-red-500',
        'N/A': 'bg-gray-400'
    };

    resultsDiv.innerHTML = `
        <div class="bg-white border-2 border-green-200 rounded-lg p-6">
            ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="w-full h-48 object-contain mb-4 rounded-lg">` : ''}

            <h3 class="text-2xl font-bold text-gray-800 mb-2">${escapeHtml(name)}</h3>
            <p class="text-gray-600 mb-4">${escapeHtml(brands)}</p>

            <!-- Nutri-Score -->
            <div class="mb-6 flex items-center justify-center">
                <span class="text-gray-700 font-semibold mr-3">Nutri-Score:</span>
                <div class="${nutriScoreColors[nutriScore]} text-white font-bold text-2xl px-4 py-2 rounded-lg shadow-lg">
                    ${nutriScore}
                </div>
            </div>

            <!-- Nutritional Info Card -->
            <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                <h4 class="text-lg font-bold text-gray-800 mb-4 text-center">Valeurs nutritionnelles (pour 100g)</h4>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-white rounded-lg p-4 shadow">
                        <div class="text-3xl font-bold text-green-600">${calories}</div>
                        <div class="text-sm text-gray-600">Calories (kcal)</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow">
                        <div class="text-3xl font-bold text-blue-600">${proteins}</div>
                        <div class="text-sm text-gray-600">Protéines (g)</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow">
                        <div class="text-3xl font-bold text-yellow-600">${carbs}</div>
                        <div class="text-sm text-gray-600">Glucides (g)</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow">
                        <div class="text-3xl font-bold text-red-600">${fats}</div>
                        <div class="text-sm text-gray-600">Lipides (g)</div>
                    </div>
                </div>

                <!-- Progress Bars -->
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-gray-700">Sucres</span>
                            <span class="font-semibold text-gray-800">${sugars}g</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="progress-bar bg-pink-500 h-2 rounded-full" style="width: ${Math.min(sugars * 2, 100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-gray-700">Fibres</span>
                            <span class="font-semibold text-gray-800">${fiber}g</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="progress-bar bg-green-500 h-2 rounded-full" style="width: ${Math.min(fiber * 5, 100)}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-gray-700">Sel</span>
                            <span class="font-semibold text-gray-800">${salt}g</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="progress-bar bg-red-500 h-2 rounded-full" style="width: ${Math.min(salt * 20, 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
                <button onclick="addToHistory('${barcode}', '${escapeHtml(name)}', ${calories}, ${proteins}, ${carbs}, ${fats}, 'barcode')"
                        class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                    ✅ Ajouter à l'historique
                </button>
                <button onclick="clearResults()"
                        class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition">
                    ✖️ Fermer
                </button>
            </div>
        </div>
    `;

    resultsDiv.classList.remove('hidden');
}

function clearResults() {
    document.getElementById('scanner-results').classList.add('hidden');
    document.getElementById('manual-barcode').value = '';
}

// ============================================
// PHOTO ANALYSIS (Clarifai + USDA)
// ============================================

function setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handlePhotoFile(files[0]);
        }
    });
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handlePhotoFile(file);
    }
}

function handlePhotoFile(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        currentPhotoBase64 = e.target.result;
        document.getElementById('preview-image').src = currentPhotoBase64;
        document.getElementById('photo-preview').classList.remove('hidden');
        document.getElementById('photo-results').classList.add('hidden');
    };

    reader.readAsDataURL(file);
}

async function analyzePhoto() {
    // Utiliser la clé Clarifai codée en dur
    if (!CLARIFAI_API_KEY) {
        showError('Clé API Clarifai non configurée');
        switchTab('settings');
        return;
    }

    if (!currentPhotoBase64) {
        showError('Veuillez d\'abord sélectionner une photo');
        return;
    }

    // Show loading
    document.getElementById('analysis-loading').classList.remove('hidden');
    document.getElementById('photo-results').classList.add('hidden');

    try {
        // Step 1: Identify foods with Clarifai
        const foods = await identifyFoodsWithClarifai(currentPhotoBase64, CLARIFAI_API_KEY);

        if (foods.length === 0) {
            showError('Aucun aliment détecté dans la photo');
            document.getElementById('analysis-loading').classList.add('hidden');
            return;
        }

        // Step 2: Get nutritional data for each food from USDA
        const foodsWithNutrition = await getNutritionForFoods(foods);

        // Step 3: Display results
        displayPhotoAnalysisResults(foodsWithNutrition);

        // Update usage counter
        incrementClarifaiUsage();

    } catch (error) {
        console.error('Error analyzing photo:', error);
        showError('Erreur lors de l\'analyse de la photo: ' + error.message);
    } finally {
        document.getElementById('analysis-loading').classList.add('hidden');
    }
}

async function identifyFoodsWithClarifai(base64Image, apiKey) {
    // Remove data URL prefix if present
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await fetch('https://api.clarifai.com/v2/models/food-item-recognition/versions/1d5fd481e0cf4826aa72ec3ff049e044/outputs', {
        method: 'POST',
        headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "inputs": [{
                "data": {
                    "image": {
                        "base64": base64Data
                    }
                }
            }]
        })
    });

    if (!response.ok) {
        throw new Error('Erreur API Clarifai: ' + response.statusText);
    }

    const data = await response.json();

    if (!data.outputs || !data.outputs[0] || !data.outputs[0].data || !data.outputs[0].data.concepts) {
        throw new Error('Format de réponse inattendu de Clarifai');
    }

    // Get top 5 foods with confidence > 0.5
    const concepts = data.outputs[0].data.concepts;
    return concepts
        .filter(concept => concept.value > 0.5)
        .slice(0, 5)
        .map(concept => ({
            name: concept.name,
            confidence: (concept.value * 100).toFixed(0)
        }));
}

async function getNutritionForFoods(foods) {
    if (!USDA_API_KEY) {
        // Return foods with estimated nutrition if no USDA key
        return foods.map(food => ({
            ...food,
            calories: Math.round(Math.random() * 200 + 50),
            proteins: Math.round(Math.random() * 20),
            carbs: Math.round(Math.random() * 30),
            fats: Math.round(Math.random() * 15),
            estimated: true
        }));
    }

    const foodsWithNutrition = [];

    for (const food of foods) {
        try {
            const nutrition = await searchUSDAFood(food.name, USDA_API_KEY);
            foodsWithNutrition.push({
                ...food,
                ...nutrition,
                estimated: false
            });
        } catch (error) {
            console.error(`Error getting nutrition for ${food.name}:`, error);
            // Add with estimated values if API fails
            foodsWithNutrition.push({
                ...food,
                calories: 100,
                proteins: 5,
                carbs: 15,
                fats: 3,
                estimated: true
            });
        }
    }

    return foodsWithNutrition;
}

function displayPhotoAnalysisResults(foods) {
    const resultsDiv = document.getElementById('photo-results');

    // Calculate totals
    const totals = foods.reduce((acc, food) => ({
        calories: acc.calories + food.calories,
        proteins: acc.proteins + food.proteins,
        carbs: acc.carbs + food.carbs,
        fats: acc.fats + food.fats
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

    resultsDiv.innerHTML = `
        <div class="bg-white border-2 border-blue-200 rounded-lg p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-4">🔍 Résultats de l'analyse</h3>

            <!-- Foods detected -->
            <div class="mb-6">
                <h4 class="font-bold text-gray-800 mb-3">Aliments détectés :</h4>
                <div class="space-y-3">
                    ${foods.map(food => `
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <span class="font-semibold text-gray-800">${escapeHtml(food.name)}</span>
                                    ${food.estimated ? '<span class="text-xs text-orange-600 ml-2">(estimé)</span>' : ''}
                                </div>
                                <span class="text-sm text-blue-600 font-semibold">${food.confidence}% confiance</span>
                            </div>
                            <div class="grid grid-cols-4 gap-2 text-sm text-center">
                                <div>
                                    <div class="font-bold text-green-600">${food.calories}</div>
                                    <div class="text-xs text-gray-600">kcal</div>
                                </div>
                                <div>
                                    <div class="font-bold text-blue-600">${food.proteins}g</div>
                                    <div class="text-xs text-gray-600">prot.</div>
                                </div>
                                <div>
                                    <div class="font-bold text-yellow-600">${food.carbs}g</div>
                                    <div class="text-xs text-gray-600">gluc.</div>
                                </div>
                                <div>
                                    <div class="font-bold text-red-600">${food.fats}g</div>
                                    <div class="text-xs text-gray-600">lip.</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Totals -->
            <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                <h4 class="text-lg font-bold text-gray-800 mb-4 text-center">Totaux estimés</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg p-4 shadow text-center">
                        <div class="text-3xl font-bold text-green-600">${Math.round(totals.calories)}</div>
                        <div class="text-sm text-gray-600">Calories</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow text-center">
                        <div class="text-3xl font-bold text-blue-600">${Math.round(totals.proteins)}</div>
                        <div class="text-sm text-gray-600">Protéines (g)</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow text-center">
                        <div class="text-3xl font-bold text-yellow-600">${Math.round(totals.carbs)}</div>
                        <div class="text-sm text-gray-600">Glucides (g)</div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow text-center">
                        <div class="text-3xl font-bold text-red-600">${Math.round(totals.fats)}</div>
                        <div class="text-sm text-gray-600">Lipides (g)</div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
                <button onclick="addPhotoMealToHistory(${JSON.stringify(foods).replace(/"/g, '&quot;')}, ${Math.round(totals.calories)}, ${Math.round(totals.proteins)}, ${Math.round(totals.carbs)}, ${Math.round(totals.fats)})"
                        class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                    ✅ Ajouter à l'historique
                </button>
                <button onclick="clearPhotoResults()"
                        class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition">
                    ✖️ Fermer
                </button>
            </div>
        </div>
    `;

    resultsDiv.classList.remove('hidden');
}

function addPhotoMealToHistory(foods, calories, proteins, carbs, fats) {
    const foodNames = foods.map(f => f.name).join(', ');
    addToHistory('photo', foodNames, calories, proteins, carbs, fats, 'photo');
}

function clearPhotoResults() {
    document.getElementById('photo-results').classList.add('hidden');
    document.getElementById('photo-preview').classList.add('hidden');
    document.getElementById('photo-input').value = '';
    currentPhotoBase64 = null;
}

function incrementClarifaiUsage() {
    let usage = parseInt(localStorage.getItem('clarifaiUsage') || '0');
    usage++;
    localStorage.setItem('clarifaiUsage', usage.toString());
    document.getElementById('clarifai-usage').textContent = usage;
}

// ============================================
// MANUAL FOOD SEARCH (USDA API)
// ============================================

async function searchFood() {
    const query = document.getElementById('food-search').value.trim();

    if (!query) {
        showError('Veuillez entrer un nom d\'aliment');
        return;
    }

    if (!USDA_API_KEY) {
        showError('Clé API USDA non configurée');
        switchTab('settings');
        return;
    }

    // Show loading
    document.getElementById('search-loading').classList.remove('hidden');
    document.getElementById('search-results').innerHTML = '';

    try {
        const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`
        );

        if (!response.ok) {
            throw new Error('Erreur API USDA: ' + response.statusText);
        }

        const data = await response.json();

        if (data.foods && data.foods.length > 0) {
            displaySearchResults(data.foods);
        } else {
            showError('Aucun aliment trouvé pour cette recherche');
            document.getElementById('search-results').innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <div class="text-6xl mb-4">🔍</div>
                    <p>Aucun résultat trouvé</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error searching food:', error);
        showError('Erreur lors de la recherche: ' + error.message);
    } finally {
        document.getElementById('search-loading').classList.add('hidden');
    }
}

async function searchUSDAFood(foodName, apiKey) {
    const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(foodName)}&pageSize=1`
    );

    if (!response.ok) {
        throw new Error('USDA API error');
    }

    const data = await response.json();

    if (!data.foods || data.foods.length === 0) {
        throw new Error('No food found');
    }

    const food = data.foods[0];
    const nutrients = food.foodNutrients || [];

    // Extract nutrients (per 100g)
    const getNearest = (codes) => {
        for (const code of codes) {
            const nutrient = nutrients.find(n => n.nutrientNumber === code || n.nutrientId === code);
            if (nutrient) return nutrient.value || 0;
        }
        return 0;
    };

    return {
        calories: Math.round(getNearest(['208', 1008])),  // Energy
        proteins: Math.round(getNearest(['203', 1003])),  // Protein
        carbs: Math.round(getNearest(['205', 1005])),     // Carbs
        fats: Math.round(getNearest(['204', 1004]))       // Fat
    };
}

function displaySearchResults(foods) {
    const resultsDiv = document.getElementById('search-results');

    resultsDiv.innerHTML = `
        <div class="space-y-3">
            ${foods.map(food => {
                const nutrients = food.foodNutrients || [];

                // Extract nutrients
                const getNearest = (codes) => {
                    for (const code of codes) {
                        const nutrient = nutrients.find(n => n.nutrientNumber === code || n.nutrientId === code);
                        if (nutrient) return nutrient.value || 0;
                    }
                    return 0;
                };

                const calories = Math.round(getNearest(['208', 1008]));
                const proteins = Math.round(getNearest(['203', 1003]));
                const carbs = Math.round(getNearest(['205', 1005]));
                const fats = Math.round(getNearest(['204', 1004]));

                return `
                    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                        <h4 class="font-bold text-gray-800 mb-2">${escapeHtml(food.description)}</h4>
                        <p class="text-sm text-gray-500 mb-3">${escapeHtml(food.brandName || food.dataType || '')}</p>

                        <div class="grid grid-cols-4 gap-2 mb-4 text-center">
                            <div class="bg-green-50 rounded p-2">
                                <div class="font-bold text-green-600">${calories}</div>
                                <div class="text-xs text-gray-600">kcal</div>
                            </div>
                            <div class="bg-blue-50 rounded p-2">
                                <div class="font-bold text-blue-600">${proteins}g</div>
                                <div class="text-xs text-gray-600">prot.</div>
                            </div>
                            <div class="bg-yellow-50 rounded p-2">
                                <div class="font-bold text-yellow-600">${carbs}g</div>
                                <div class="text-xs text-gray-600">gluc.</div>
                            </div>
                            <div class="bg-red-50 rounded p-2">
                                <div class="font-bold text-red-600">${fats}g</div>
                                <div class="text-xs text-gray-600">lip.</div>
                            </div>
                        </div>

                        <button onclick="addToHistory('usda', '${escapeHtml(food.description).replace(/'/g, "\\'")}', ${calories}, ${proteins}, ${carbs}, ${fats}, 'search')"
                                class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm">
                            ✅ Ajouter à l'historique
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ============================================
// HISTORY & LOCAL STORAGE
// ============================================

function addToHistory(id, name, calories, proteins, carbs, fats, type) {
    const entry = {
        id: Date.now(),
        barcode: id,
        name: name,
        calories: calories,
        proteins: proteins,
        carbs: carbs,
        fats: fats,
        timestamp: new Date().toISOString(),
        type: type
    };

    let history = getHistory();
    history.unshift(entry);
    localStorage.setItem('nutritionHistory', JSON.stringify(history));

    showSuccess(`"${name}" ajouté à l'historique !`);

    // Update summary if on history page
    updateDailySummary();
    updateGoalProgress();
    updateCaloriesChart();

    // Clear results based on type
    if (type === 'barcode') {
        clearResults();
    } else if (type === 'photo') {
        clearPhotoResults();
    }
}

function getHistory() {
    const history = localStorage.getItem('nutritionHistory');
    return history ? JSON.parse(history) : [];
}

function getTodayHistory() {
    const history = getHistory();
    const today = new Date().toDateString();

    return history.filter(entry => {
        const entryDate = new Date(entry.timestamp).toDateString();
        return entryDate === today;
    });
}

function loadHistory() {
    const history = getTodayHistory();
    const historyList = document.getElementById('history-list');
    const emptyHistory = document.getElementById('empty-history');

    if (history.length === 0) {
        historyList.innerHTML = '';
        emptyHistory.classList.remove('hidden');
        return;
    }

    emptyHistory.classList.add('hidden');

    const typeIcons = {
        'barcode': '📷',
        'photo': '🍽️',
        'search': '🔍'
    };

    historyList.innerHTML = history.map(entry => {
        const time = new Date(entry.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xl">${typeIcons[entry.type] || '📝'}</span>
                            <h4 class="font-bold text-gray-800 text-lg">${escapeHtml(entry.name)}</h4>
                        </div>
                        <p class="text-sm text-gray-500">⏰ ${time}</p>
                    </div>
                    <button onclick="deleteEntry(${entry.id})"
                            class="text-red-500 hover:text-red-700 font-bold text-xl">
                        🗑️
                    </button>
                </div>

                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="bg-green-50 rounded p-2">
                        <div class="font-bold text-green-600">${Math.round(entry.calories)}</div>
                        <div class="text-xs text-gray-600">kcal</div>
                    </div>
                    <div class="bg-blue-50 rounded p-2">
                        <div class="font-bold text-blue-600">${Math.round(entry.proteins)}</div>
                        <div class="text-xs text-gray-600">prot.</div>
                    </div>
                    <div class="bg-yellow-50 rounded p-2">
                        <div class="font-bold text-yellow-600">${Math.round(entry.carbs)}</div>
                        <div class="text-xs text-gray-600">gluc.</div>
                    </div>
                    <div class="bg-red-50 rounded p-2">
                        <div class="font-bold text-red-600">${Math.round(entry.fats)}</div>
                        <div class="text-xs text-gray-600">lip.</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function deleteEntry(id) {
    if (confirm('Voulez-vous vraiment supprimer cette entrée ?')) {
        let history = getHistory();
        history = history.filter(entry => entry.id !== id);
        localStorage.setItem('nutritionHistory', JSON.stringify(history));

        loadHistory();
        updateDailySummary();
        updateGoalProgress();
        updateCaloriesChart();
        showSuccess('Entrée supprimée');
    }
}

function clearHistory() {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique d\'aujourd\'hui ?')) {
        const allHistory = getHistory();
        const today = new Date().toDateString();

        const filteredHistory = allHistory.filter(entry => {
            const entryDate = new Date(entry.timestamp).toDateString();
            return entryDate !== today;
        });

        localStorage.setItem('nutritionHistory', JSON.stringify(filteredHistory));

        loadHistory();
        updateDailySummary();
        updateGoalProgress();
        updateCaloriesChart();
        showSuccess('Historique du jour effacé');
    }
}

function updateDailySummary() {
    const history = getTodayHistory();

    let totalCalories = 0;
    let totalProteins = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    history.forEach(entry => {
        totalCalories += parseFloat(entry.calories) || 0;
        totalProteins += parseFloat(entry.proteins) || 0;
        totalCarbs += parseFloat(entry.carbs) || 0;
        totalFats += parseFloat(entry.fats) || 0;
    });

    document.getElementById('total-calories').textContent = Math.round(totalCalories);
    document.getElementById('total-proteins').textContent = totalProteins.toFixed(1);
    document.getElementById('total-carbs').textContent = totalCarbs.toFixed(1);
    document.getElementById('total-fats').textContent = totalFats.toFixed(1);
}

// ============================================
// CALORIE GOAL TRACKING
// ============================================

function updateGoalProgress() {
    const history = getTodayHistory();
    const consumed = history.reduce((sum, entry) => sum + (parseFloat(entry.calories) || 0), 0);
    const goal = parseInt(localStorage.getItem('calorieGoal') || '2000');

    const percentage = Math.min((consumed / goal) * 100, 100);
    const remaining = Math.max(goal - consumed, 0);

    document.getElementById('calories-consumed').textContent = Math.round(consumed);
    document.getElementById('goal-percentage').textContent = Math.round(percentage) + '%';
    document.getElementById('calories-remaining').textContent = Math.round(remaining);
    document.getElementById('goal-bar').style.width = percentage + '%';

    // Change color based on percentage
    const goalBar = document.getElementById('goal-bar');
    if (percentage < 80) {
        goalBar.className = 'progress-bar bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full';
    } else if (percentage < 100) {
        goalBar.className = 'progress-bar bg-gradient-to-r from-yellow-500 to-yellow-600 h-4 rounded-full';
    } else {
        goalBar.className = 'progress-bar bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full';
    }
}

// ============================================
// 7-DAY CALORIES CHART
// ============================================

function initializeCaloriesChart() {
    const ctx = document.getElementById('calories-chart');
    if (!ctx) return;

    const data = getLast7DaysData();

    caloriesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Calories',
                data: data.values,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' kcal';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateCaloriesChart() {
    if (!caloriesChart) return;

    const data = getLast7DaysData();
    caloriesChart.data.labels = data.labels;
    caloriesChart.data.datasets[0].data = data.values;
    caloriesChart.update();
}

function getLast7DaysData() {
    const days = [];
    const values = [];
    const history = getHistory();

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();

        // Get day name
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        days.push(dayName);

        // Calculate calories for that day
        const dayCalories = history
            .filter(entry => new Date(entry.timestamp).toDateString() === dateString)
            .reduce((sum, entry) => sum + (parseFloat(entry.calories) || 0), 0);

        values.push(Math.round(dayCalories));
    }

    return { labels: days, values: values };
}

// ============================================
// CSV EXPORT
// ============================================

function exportToCSV() {
    const history = getHistory();

    if (history.length === 0) {
        showError('Aucune donnée à exporter');
        return;
    }

    // CSV Header
    let csv = 'Date,Heure,Type,Nom,Calories,Protéines (g),Glucides (g),Lipides (g)\n';

    // CSV Rows
    history.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleDateString('fr-FR');
        const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        const typeNames = {
            'barcode': 'Scanner',
            'photo': 'Photo',
            'search': 'Recherche'
        };

        csv += `${dateStr},${timeStr},${typeNames[entry.type] || entry.type},`;
        csv += `"${entry.name.replace(/"/g, '""')}",`;
        csv += `${Math.round(entry.calories)},`;
        csv += `${Math.round(entry.proteins)},`;
        csv += `${Math.round(entry.carbs)},`;
        csv += `${Math.round(entry.fats)}\n`;
    });

    // Create download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fileName = `nutritrack_export_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('Export CSV réussi !');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in max-w-md`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

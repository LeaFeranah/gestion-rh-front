import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  DollarSign,
  Hash,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getHistoriqueBySalaire,
  getHistoriqueSalaireParEmploye,
} from "../../services/employeeService";

const HistoriqueSalaire = ({ employeId, salaireId }) => {
  const [historiques, setHistoriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fonction pour charger l'historique
  const loadHistorique = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      if (salaireId) {
        data = await getHistoriqueBySalaire(salaireId);
        setHistoriques(data.historiques || []);
      } else if (employeId) {
        data = await getHistoriqueSalaireParEmploye(employeId);
        setHistoriques(data || []);
      } else {
        throw new Error("Aucun identifiant fourni pour charger l'historique");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du chargement de l'historique"
      );
    } finally {
      setLoading(false);
    }
  }, [salaireId, employeId]);

  // Charger l'historique au montage
  useEffect(() => {
    if (salaireId || employeId) {
      loadHistorique();
    }
  }, [salaireId, employeId, loadHistorique]);


  // Préparer les données pour le graphique
  const prepareChartData = () => {
    if (!historiques || historiques.length === 0) return [];

    const sortedHistoriques = [...historiques].sort((a, b) => {
      const dateA = new Date(
        a.date_modification || a.created_at || a.dateModification
      );
      const dateB = new Date(
        b.date_modification || b.created_at || b.dateModification
      );
      return dateA - dateB;
    });

    return sortedHistoriques.map((hist) => {
      const salaireTotal = Number(
        hist.nouveau_salaire_total ||
          hist.nouveauSalaireTotal ||
          hist.salaire_total ||
          hist.salaireTotal ||
          0
      );

      const salaireArrondi = Math.round(salaireTotal * 100) / 100;
      const fullDate =
        hist.date_modification || hist.created_at || hist.dateModification;
      const date = new Date(fullDate);

      return {
        // Utiliser date ET heure pour différencier les modifications du même jour
        date: date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        // Stocker aussi la date complète pour le tooltip
        fullDateTime: date.toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        "Salaire Total": salaireArrondi,
        originalDate: fullDate,
        timestamp: date.getTime(),
      };
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      const dateFormatted = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const timeFormatted = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return `${dateFormatted} ${timeFormatted}`;
    } catch {
      return "";
    }
  };

  // Formater un montant
  const formatMontant = (montant) => {
    if (!montant && montant !== 0) return "-";
    const montantNum = Number(montant);
    if (isNaN(montantNum)) return "-";

    const montantArrondi = Math.round(montantNum * 100) / 100;
    return `${montantArrondi.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} Ar`;
  };

  // Préparer les données pour le tableau
  const prepareTableData = () => {
    if (!historiques || historiques.length === 0) return [];

    // Trier du plus récent au plus ancien
    const sortedHistoriques = [...historiques].sort((a, b) => {
      const dateA = new Date(
        a.date_modification || a.created_at || a.dateModification
      );
      const dateB = new Date(
        b.date_modification || b.created_at || b.dateModification
      );
      return dateB - dateA;
    });

    return sortedHistoriques.map((hist, index) => ({
      id: hist.id || index,
      dateTime: formatDateTime(
        hist.date_modification || hist.created_at || hist.dateModification
      ),
      indice: hist.nouvelle_indice || hist.nouvelleIndice || hist.indice || "-",
      tauxHoraire:
        hist.nouveau_taux_horaire ||
        hist.nouveauTauxHoraire ||
        hist.taux_horaire ||
        hist.tauxHoraire,
      salaireBase:
        hist.nouveau_salaire_base ||
        hist.nouveauSalaireBase ||
        hist.salaire_base ||
        hist.salaireBase,
      primeAnciennete:
        hist.nouvelle_prime_anciennete ||
        hist.nouvellePrimeAnciennete ||
        hist.prime_anciennete ||
        hist.primeAnciennete,
      indemniteDeplacement:
        hist.nouvelle_indemnite_deplacement ||
        hist.nouvelleIndemniteDeplacement ||
        hist.indemnite_deplacement ||
        hist.indemniteDeplacement,
      autreIndemnite:
        hist.nouvelle_autre_indemnite ||
        hist.nouvelleAutreIndemnite ||
        hist.autre_indemnite ||
        hist.autreIndemnite,
      salaireTotal:
        hist.nouveau_salaire_total ||
        hist.nouveauSalaireTotal ||
        hist.salaire_total ||
        hist.salaireTotal,
      motif: hist.motif,
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const fullDateTime = payload[0]?.payload?.fullDateTime || label;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{fullDateTime}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="font-medium">{formatMontant(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tableData = prepareTableData();
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentItems = tableData.slice(startIndex, startIndex + itemsPerPage);
  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500">Chargement de l'historique...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="text-center py-4">
          <div className="text-red-500 text-sm mb-2">Erreur: {error}</div>
          <button
            onClick={loadHistorique}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 mt-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 pb-4 border-b border-gray-200 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Historique des Salaires
          </h3>
          <p className="text-sm text-gray-500">
            {historiques.length} modification(s) enregistrée(s)
          </p>
        </div>

        {historiques.length > 0 && (
          <button
            onClick={loadHistorique}
            className="flex items-center gap-2 px-4 py-1 border bg-akj text-white rounded-md transition text-sm font-medium mt-2 sm:mt-0"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        )}
      </div>

      {/* Graphique d'évolution */}
      {chartData.length > 0 && (
        <div className="p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Évolution du Salaire Total
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 40, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                padding={{ left: 40, right: 40 }}
                interval={0}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k Ar`}
                width={80}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#2563eb",
                  strokeWidth: 2,
                  strokeDasharray: "5 5",
                }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="Salaire Total"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 6, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  r: 8,
                  stroke: "#2563eb",
                  strokeWidth: 3,
                  fill: "#fff",
                }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tableau des nouveaux salaires */}
      {tableData.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Aucun historique de salaire disponible
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Les modifications de salaire apparaîtront ici
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    <div className="flex items-center gap-1">Date & Heure</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    <div className="flex items-center gap-1">Indice</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Taux Horaire
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Salaire de Base
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Prime Ancienneté
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Ind. Déplacement
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Autre Ind.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-300">
                    <div className="flex items-center gap-1">Salaire Total</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t border-gray-300 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <div className="text-sm font-medium text-gray-900">
                        {item.dateTime}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <div className="text-sm font-medium text-gray-900">
                        {item.indice}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <div className="text-sm text-gray-900">
                        {formatMontant(item.tauxHoraire)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatMontant(item.salaireBase)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <div className="text-sm text-gray-900">
                        {formatMontant(item.primeAnciennete)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <div className="text-sm text-gray-900">
                        {formatMontant(item.indemniteDeplacement)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <div className="text-sm text-gray-900">
                        {formatMontant(item.autreIndemnite)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {formatMontant(item.salaireTotal)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-300 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage {startIndex + 1} à{" "}
                {Math.min(startIndex + itemsPerPage, tableData.length)}
                sur {tableData.length} modifications
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className={`p-2 rounded-md border border-gray-300 ${
                    currentPage === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage + 1} sur {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                  className={`p-2 rounded-md border border-gray-300 ${
                    currentPage >= totalPages - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoriqueSalaire;

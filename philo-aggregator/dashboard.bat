@echo off
REM Lanceur du tableau de bord local (le « dashboard »).
REM Double-cliquer sur ce fichier ouvre le dashboard dans le navigateur.
REM
REM %~dp0 = dossier où se trouve ce .bat (philo-aggregator). On s'y place
REM d'abord pour que python trouve aggregate.py quel que soit l'endroit
REM d'où le raccourci est lancé.
cd /d "%~dp0"
python aggregate.py dashboard

REM Si python plante (dépendance manquante, etc.), la fenêtre reste ouverte
REM pour qu'on puisse lire le message d'erreur au lieu de se fermer aussitôt.
if errorlevel 1 pause

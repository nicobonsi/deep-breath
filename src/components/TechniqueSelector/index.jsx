import { motion } from 'framer-motion';
import { techniques } from '../../data/techniques';

const categoryLabels = {
  breathing:  'Breathing',
  meditation: 'Meditation',
};

export function TechniqueSelector({ selected, onSelect, onClose }) {
  const categories = [...new Set(techniques.map(t => t.category))];

  return (
    <motion.div
      className="technique-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="technique-panel"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="panel-header">
          <h2>Choose a Technique</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {categories.map(cat => (
          <section key={cat} className="technique-category">
            <h3 className="category-label">{categoryLabels[cat] ?? cat}</h3>
            <div className="technique-grid">
              {techniques.filter(t => t.category === cat).map(t => (
                <button
                  key={t.id}
                  className={`technique-card ${selected?.id === t.id ? 'selected' : ''}`}
                  style={{ '--accent': t.color }}
                  onClick={() => { onSelect(t); onClose(); }}
                >
                  <div className="technique-dot" style={{ background: t.color }} />
                  <div className="technique-info">
                    <strong>{t.name}</strong>
                    <p>{t.description}</p>
                  </div>
                  <div className="technique-timing">
                    {t.duration
                      ? t.duration
                      : `${t.phases.map(p => p.duration).join('-')}s`}
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </motion.div>
    </motion.div>
  );
}

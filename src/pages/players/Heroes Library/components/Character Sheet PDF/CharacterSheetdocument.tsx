import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PDF_FONT_FAMILY } from './pdfFonts';
import type { PdfCharacterData, PdfCurrency } from './PdfCharacterData';

const INK = '#2b1d0e';
const LINE = '#8a6d3b';

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 9,
    padding: 20,
    color: INK,
  },

  // ---- Шапка -------------------------------------------------
  headerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  headerBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 5,
  },
  classBox: {
    flex: 1.6,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 5,
  },
  nameBox: {
    flex: 1.1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 6,
    justifyContent: 'center',
  },
  nameValue: {
    fontSize: 12,
  },
  boxLabel: {
    fontSize: 7,
    color: LINE,
    marginBottom: 2,
  },
  boxValue: {
    fontSize: 11,
  },
  avatarBox: {
    width: 96,
    height: 96,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: LINE,
  },
  levelBox: {
    width: 80,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  levelValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelLabel: {
    fontSize: 6,
    color: LINE,
  },
  expLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: LINE,
    minWidth: 40,
    minHeight: 12,
  },

  // ---- Верхняя полоса статов (инициатива/скорость/размер и т.п.)
  statStrip: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
  },

  // ---- Тело: колонка характеристик + правая часть ------------
  body: {
    flexDirection: 'row',
    gap: 8,
  },
  abilityColumn: {
    width: 150,
    flexDirection: 'column',
    gap: 6,
    marginTop: 6,
  },
  rightColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 6,
  },

  // ---- Бокс одной характеристики ------------------------------
  abilityBox: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 5,
  },
  abilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  abilityCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: LINE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abilityModifier: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  abilityTitleBlock: {
    flexDirection: 'column',
  },
  abilityName: {
    fontSize: 10,
    fontWeight: 'semibold',
  },
  abilityScoreLabel: {
    fontSize: 10,
    color: LINE,
  },
  abilityScoreValue: {
    fontSize: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 1,
  },
  checkRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkbox: {
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 3.5,
  },
  checkboxFilled: {
    backgroundColor: LINE,
  },
  checkLabelBold: {
    fontSize: 8,
    fontWeight: 'semibold',
  },
  checkLabel: {
    fontSize: 8,
  },

  // ---- Секции с заголовком (снаряжение, умения и т.д.) --------
  section: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'semibold',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: LINE,
    minHeight: 11,
    flex: 1,
  },

  // ---- Оружие и боевые заговоры (таблица) ---------------------
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.75,
    borderBottomColor: LINE,
    paddingBottom: 2,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    borderBottomWidth: 0.25,
    borderBottomColor: LINE,
  },
  colName: { flex: 2 },
  colBonus: { flex: 1 },
  colDamage: { flex: 1.2 },
  colNotes: { flex: 2 },
  tableHeaderText: {
    fontSize: 7,
    color: LINE,
    fontWeight: 'semibold',
  },
  tableCellText: {
    fontSize: 8,
  },

  // ---- Текстовые блоки (умения/черты/особенности) -------------
  freeTextBlock: {
    fontSize: 8,
    lineHeight: 1.4,
  },
  featItem: {
    marginBottom: 4,
  },
  featName: {
    fontSize: 8,
    fontWeight: 'semibold',
  },
  featDescription: {
    fontSize: 7.5,
    color: '#4a3a20',
  },
  teamCard: {
    width: 100,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 4,
    marginRight: 2,
    marginBottom: 6,
  },
  teamCardName: {
    fontSize: 9,
    fontWeight: 'semibold',
  },
  teamCardMeta: {
    fontSize: 7,
    color: LINE,
  },
  equipTableRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    borderBottomWidth: 0.25,
    borderBottomColor: LINE,
  },
  equipColName: { flex: 1.6 },
  equipColBonus: { flex: 1.4 },
  equipColFeatures: { flex: 2 },
  equipColQty: { flex: 0.6 },
  currencyRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  currencyItem: {
    alignItems: 'center',
    width: 50,
  },
  currencyLabel: {
    fontSize: 7,
    color: LINE,
  },
  currencyValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  // ---- Страница 3: заклинания ----
  spellStatBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 5,
    alignItems: 'center',
  },
  spellStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slotBox: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 3,
    alignItems: 'center',
    width: 55,
  },
  slotLevelLabel: {
    fontSize: 6.5,
    color: LINE,
  },
  slotValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  spellTableRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    borderBottomWidth: 0.25,
    borderBottomColor: LINE,
  },
  spellColName: { flex: 2 },
  spellColLevel: { flex: 0.6 },
  spellColSchool: { flex: 1 },
  spellColTime: { flex: 1 },
  spellColRange: { flex: 1 },
  spellColTags: { flex: 1.2 },
});

interface CharacterSheetDocumentProps {
  data: PdfCharacterData;
}

function formatModifierLike(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function ValueOrBlank({ isBlank, value }: { isBlank: boolean; value: string | number }) {
  if (isBlank) return <View style={styles.emptyLine} />;
  return <Text style={styles.boxValue}>{String(value)}</Text>;
}

function Checkbox({ checked }: { checked: boolean }) {
  return <View style={checked ? [styles.checkbox, styles.checkboxFilled] : styles.checkbox} />;
}

function AbilityBox({
  ability,
  isBlank,
}: {
  ability: PdfCharacterData['abilityScores'][number];
  isBlank: boolean;
}) {
  console.log('skill sample:', ability.skills[0]);
  return (
    <View style={styles.abilityBox}>
      <View style={styles.abilityHeader}>
        <View style={styles.abilityCircle}>
          {isBlank ? null : <Text style={styles.abilityModifier}>{ability.modifierLabel}</Text>}
        </View>
        <View style={styles.abilityTitleBlock}>
          <Text style={styles.abilityName}>{ability.label}</Text>
          <Text style={styles.abilityScoreLabel}>
            значение: <Text style={styles.abilityScoreValue}>{isBlank ? '__' : ability.score}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.checkRow}>
        <View style={styles.checkRowLeft}>
          <Checkbox checked={!isBlank && ability.isSavingThrowProficient} />
          <Text style={styles.checkLabelBold}>Спасбросок</Text>
        </View>
        {!isBlank && <Text style={styles.checkLabelBold}>{ability.savingThrowModifierLabel}</Text>}
      </View>

      {ability.skills.map((skill) => (
        <View key={skill.name} style={styles.checkRow}>
          <View style={styles.checkRowLeft}>
            <Checkbox checked={!isBlank && skill.isProficient} />
            <Text style={styles.checkLabel}>{skill.name}</Text>
          </View>
          {!isBlank && <Text style={styles.checkLabel}>{skill.modifierLabel}</Text>}
        </View>
      ))}
    </View>
  );
}

export function CharacterSheetDocument({ data }: CharacterSheetDocumentProps) {
  const classesLabel = data.classes.length
    ? data.classes
        .map((c) => `${c.className} (ур. ${c.level}${c.subclass ? `, ${c.subclass}` : ''})`)
        .join(' · ')
    : '';
  function splitTextIntoColumns(text: string, columns = 2): string[][] {
    if (!text) return Array.from({ length: columns }, () => []);

    const lines = text.split('\n').filter((line) => line.trim() !== '');
    const perColumn = Math.ceil(lines.length / columns);

    const result: string[][] = [];
    for (let i = 0; i < columns; i++) {
      result.push(lines.slice(i * perColumn, (i + 1) * perColumn));
    }
    return result;
  }
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Шапка: аватар, имя/предыстория/класс/вид, уровень+опыт */}
        <View style={[styles.headerRow, { height: 150 }]}>
          {data.avatarSrc && !data.isBlank ? (
            <Image src={data.avatarSrc} style={styles.avatarBox} />
          ) : (
            <View style={styles.avatarBox} />
          )}
          <View style={styles.levelBox}>
            <Text style={styles.levelLabel}>УРОВЕНЬ</Text>
            {data.isBlank ? (
              <View style={styles.emptyLine} />
            ) : (
              <Text style={styles.levelValue}>{data.level}</Text>
            )}
            <Text style={styles.levelLabel}>ОПЫТ</Text>
          </View>

          <View style={styles.nameBox}>
            <Text style={styles.boxLabel}>Имя персонажа</Text>
            {data.isBlank ? (
              <View style={styles.emptyLine} />
            ) : (
              <Text style={styles.nameValue}>{data.name}</Text>
            )}
            <Text style={styles.boxLabel}>Вид</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.race} />
            <Text style={styles.boxLabel}>Подкласс</Text>
            {data.isBlank ? (
              <View style={styles.emptyLine} />
            ) : (
              <Text>
                {data.classes
                  .map((c) => c.subclass)
                  .filter(Boolean)
                  .join(', ') || '—'}
              </Text>
            )}
            <Text style={styles.boxLabel}>Предыстория</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.background} />
            <Text style={styles.boxLabel}>Класс</Text>
            {data.isBlank ? <View style={styles.emptyLine} /> : <Text>{classesLabel || '—'}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Хиты и кости хитов</Text>
            <View style={styles.statStrip}>
              <View style={[styles.statBox, { height: 40 }]}>
                <Text style={styles.boxLabel}>Текущие</Text>
              </View>
              <View style={[styles.statBox, { height: 40 }]}>
                <Text style={styles.boxLabel}>Макс.</Text>
                <ValueOrBlank isBlank={data.isBlank} value={data.hitPoints.max} />
              </View>
            </View>
            <View style={styles.statStrip}>
              <View style={[styles.statBox, { height: 40 }]}>
                <Text style={styles.boxLabel}>Врем.</Text>
              </View>
              <View style={[styles.statBox, { height: 40 }]}>
                <Text style={styles.boxLabel}>Кости хитов</Text>
                {data.isBlank ? (
                  <View style={styles.emptyLine} />
                ) : (
                  <Text>{data.hitDice.type}</Text>
                )}
              </View>
            </View>
            <View style={[styles.section, { marginTop: 12 }]}>
              <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Спасброски от смерти</Text>
              <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.checkLabelBold}>Успехи:</Text>
                  {[0, 1, 2].map((i) => (
                    <Checkbox key={i} checked={!data.isBlank && data.deathSaves.successes > i} />
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.checkLabelBold}>Провалы:</Text>
                  {[0, 1, 2].map((i) => (
                    <Checkbox key={i} checked={!data.isBlank && data.deathSaves.failures > i} />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Полоса: бонус мастерства, инициатива, скорость, размер, ... */}
        <View style={styles.statStrip}>
          <View style={styles.statBox}>
            <Text style={styles.boxLabel}>Бонус мастерства</Text>
            <ValueOrBlank isBlank={data.isBlank} value={`+${data.proficiencyBonus}`} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.boxLabel}>Класс защиты</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.armorClass} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.boxLabel}>Инициатива</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.initiative} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.boxLabel}>Скорость</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.speed} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.boxLabel}>Размер</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.size} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.boxLabel}>Истощение</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.exhaustionLevel} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.boxLabel}>Пас.внимат.</Text>
            <ValueOrBlank isBlank={data.isBlank} value={data.passivePerception} />
          </View>
          <View style={styles.section}>
            <Text style={styles.boxLabel}>Состояния</Text>
            <Text style={styles.boxValue}></Text>
          </View>
        </View>

        {/* Тело: колонка характеристик слева + хиты/спасброски справа */}
        <View style={styles.body}>
          <View style={styles.abilityColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Героическое вдохновение</Text>
              <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
                <Checkbox checked={!data.isBlank && data.inspiration} />
              </View>
            </View>
            {data.abilityScores.map((ability) => (
              <AbilityBox key={ability.key} ability={ability} isBlank={data.isBlank} />
            ))}
          </View>

          <View style={styles.rightColumn}>
            {/* Оружие и боевые заговоры */}
            <View style={[styles.section, { marginTop: 6, height: 130, maxHeight: 130 }]}>
              <Text style={styles.sectionTitle}>Оружие и боевые заговоры</Text>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, styles.colName]}>Название</Text>
                <Text style={[styles.tableHeaderText, styles.colBonus]}>Бонус атаки/СЛ</Text>
                <Text style={[styles.tableHeaderText, styles.colDamage]}>Урон и тип</Text>
                <Text style={[styles.tableHeaderText, styles.colNotes]}>Примечания</Text>
              </View>
              {data.isBlank || data.combatAbilities.length === 0
                ? Array.from({ length: data.isBlank ? 4 : 0 }).map((_, i) => (
                    <View key={i} style={styles.tableRow}>
                      <View style={[styles.colName, styles.emptyLine]} />
                      <View style={[styles.colBonus, styles.emptyLine, { marginLeft: 4 }]} />
                      <View style={[styles.colDamage, styles.emptyLine, { marginLeft: 4 }]} />
                      <View style={[styles.colNotes, styles.emptyLine, { marginLeft: 4 }]} />
                    </View>
                  ))
                : data.combatAbilities.map((ability, i) => (
                    <View key={`${ability.name}-${i}`} style={styles.tableRow}>
                      <Text style={[styles.tableCellText, styles.colName]}>{ability.name}</Text>
                      <Text style={[styles.tableCellText, styles.colBonus]}>
                        {ability.bonus != null ? formatModifierLike(ability.bonus) : '—'}
                      </Text>
                      <Text style={[styles.tableCellText, styles.colDamage]}>
                        {ability.damage || '—'}
                      </Text>
                      <Text style={[styles.tableCellText, styles.colNotes]}>
                        {ability.description || ''}
                      </Text>
                    </View>
                  ))}
            </View>
            {/* Классовые умения */}
            <View style={[styles.section, { marginTop: 6, height: 200, width: '100%' }]}>
              <Text style={styles.sectionTitle}>Классовые умения</Text>
              {data.isBlank || !data.classFeatures ? (
                <View style={[styles.emptyLine, { height: 200 }]} />
              ) : (
                <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
                  {splitTextIntoColumns(data.classFeatures, 2).map((columnLines, idx) => (
                    <View key={idx} style={{ flex: 1, width: '20vw' }}>
                      {columnLines.map((line, lineIdx) => (
                        <Text key={lineIdx} style={styles.freeTextBlock}>
                          {line}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
            {/* Особенности вида + Черты — двумя колонками */}
            <View
              style={{ flexDirection: 'row', gap: 8, marginTop: 6, height: 150, maxHeight: 150 }}
            >
              <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>Особенности вида</Text>
                {data.isBlank || !data.raceFeatures ? (
                  <View style={[styles.emptyLine, { minHeight: 30 }]} />
                ) : (
                  <Text style={styles.freeTextBlock}>{data.raceFeatures}</Text>
                )}
              </View>

              <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>Черты</Text>
                {data.isBlank || data.feats.length === 0 ? (
                  <View style={[styles.emptyLine, { minHeight: 30 }]} />
                ) : (
                  data.feats.map((feat, i) => (
                    <View key={`${feat.name}-${i}`} style={styles.featItem}>
                      <Text style={styles.featName}>{feat.name}</Text>
                      {feat.description && (
                        <Text style={styles.featDescription}>{feat.description}</Text>
                      )}
                    </View>
                  ))
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <View style={[styles.section, { flex: 2 }]}>
                <Text style={styles.sectionTitle}>Владение экипировкой</Text>
                {data.isBlank ? (
                  <View style={styles.emptyLine} />
                ) : (
                  <>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>
                      Оружие: {data.weaponProficiencies.join(', ') || '—'}
                    </Text>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>
                      Доспехи: {data.armorProficiencies.join(', ') || '—'}
                    </Text>
                    <Text style={{ fontSize: 8 }}>
                      Инструменты: {data.toolProficiencies.join(', ') || '—'}
                    </Text>
                  </>
                )}
              </View>
              <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>Языки</Text>
                {data.isBlank ? (
                  <View style={styles.emptyLine} />
                ) : (
                  <Text style={{ fontSize: 8 }}>{data.languages.join(', ') || '—'}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page} wrap>
        {/* Команда */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <Text style={styles.sectionTitle}>Команда</Text>
          {data.teamMembers.length === 0 ? (
            <View style={[styles.emptyLine, { minHeight: 20 }]} />
          ) : (
            <View style={{ flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
              {data.teamMembers.map((member, i) => (
                <View key={i} style={styles.teamCard}>
                  {data.avatarSrc && !data.isBlank ? (
                    <Image src={member.avatarSrc} style={styles.avatarBox} />
                  ) : (
                    <View style={styles.avatarBox} />
                  )}
                  <Text style={styles.teamCardName}>{member.name || '—'}</Text>
                  <Text style={styles.teamCardMeta}>{member.race}</Text>
                  <Text style={styles.teamCardMeta}>
                    {member.className}
                    {member.subclass ? `, ${member.subclass}` : ''} (ур. {member.level})
                  </Text>
                  {member.notes ? (
                    <Text style={[styles.teamCardMeta, { marginTop: 2 }]}>{member.notes}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Предыстория + Внешность */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 8,
            height: 200,
            maxHeight: 200,
            paddingBottom: 8,
          }}
        >
          <View style={[styles.section, { flex: 2 }]}>
            <Text style={styles.sectionTitle}>Предыстория</Text>
            {data.backstory ? (
              <Text style={styles.freeTextBlock}>{data.backstory}</Text>
            ) : (
              <View style={[styles.emptyLine, { minHeight: 60 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Внешность</Text>
            {data.appearance ? (
              <Text style={styles.freeTextBlock}>{data.appearance}</Text>
            ) : (
              <View style={[styles.emptyLine, { minHeight: 60 }]} />
            )}
          </View>
        </View>

        {/* Доп. особенности + Цели кампании */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 8,
            height: 120,
            maxHeight: 120,
            paddingBottom: 8,
          }}
        >
          <View style={[styles.section, { flex: 2 }]}>
            <Text style={styles.sectionTitle}>Дополнительные особенности</Text>
            {data.additionalFeatures ? (
              <Text style={styles.freeTextBlock}>{data.additionalFeatures}</Text>
            ) : (
              <View style={[styles.emptyLine, { minHeight: 40 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Цели кампании</Text>
            {data.campaignGoals ? (
              <Text style={styles.freeTextBlock}>{data.campaignGoals}</Text>
            ) : (
              <View style={[styles.emptyLine, { minHeight: 40 }]} />
            )}
          </View>
        </View>

        {/* Экипировка + Рюкзак */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <View style={[styles.section, { flex: 2 }]}>
            <Text style={styles.sectionTitle}>Экипировано</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.equipColName]}>Название</Text>
              <Text style={[styles.tableHeaderText, styles.equipColBonus]}>Боевой бонус</Text>
              <Text style={[styles.tableHeaderText, styles.equipColFeatures]}>Особенности</Text>
            </View>
            {data.equippedItems.length === 0 ? (
              <View style={[styles.emptyLine, { minHeight: 30 }]} />
            ) : (
              data.equippedItems.map((item, i) => (
                <View key={i} style={styles.equipTableRow}>
                  <Text style={[styles.tableCellText, styles.equipColName]}>{item.name}</Text>
                  <Text style={[styles.tableCellText, styles.equipColBonus]}>
                    {item.bonusLabel}
                  </Text>
                  <Text style={[styles.tableCellText, styles.equipColFeatures]}>
                    {item.featuresLabel}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Рюкзак</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.equipColName]}>Название</Text>
              <Text style={[styles.tableHeaderText, styles.equipColQty]}>Описание</Text>
            </View>
            {data.backpackItems.length === 0 ? (
              <View style={[styles.emptyLine, { minHeight: 30 }]} />
            ) : (
              data.backpackItems.map((item, i) => (
                <View key={i} style={styles.equipTableRow}>
                  <Text style={[styles.tableCellText, styles.equipColName]}>{item.name}</Text>
                  <Text style={[styles.tableCellText, styles.equipColQty]}>{item.description}</Text>
                </View>
              ))
            )}
          </View>
          {/* Монеты + Переносимый вес */}
          <View style={{ flexDirection: 'column', gap: 8, flex: 1 }}>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.sectionTitle}>Монеты</Text>
              <View style={styles.currencyRow}>
                {[
                  { key: 'copper', label: 'ММ' },
                  { key: 'silver', label: 'СМ' },
                  { key: 'gold', label: 'ЗМ' },
                  { key: 'electrum', label: 'ЭМ' },
                  { key: 'platinum', label: 'ПМ' },
                ].map(({ key, label }) => (
                  <View key={key} style={styles.currencyItem}>
                    <Text style={styles.currencyLabel}>{label}</Text>
                    <Text style={styles.currencyValue}>
                      {data.currency[key as keyof PdfCurrency]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.sectionTitle}>Переносимый вес</Text>
              <Text style={[styles.boxValue, { textAlign: 'center' }]}>
                {data.carryCapacity.current} / {data.carryCapacity.max}
              </Text>
            </View>
          </View>
        </View>

        {/* Расходники + Сокровища + Магические предметы */}
        <View
          style={{ flexDirection: 'row', gap: 8, marginBottom: 8, height: 140, maxHeight: 140 }}
        >
          <View style={[styles.section, { flex: 2 }]}>
            <Text style={styles.sectionTitle}>Сокровища</Text>
            {data.treasures ? (
              <Text style={styles.freeTextBlock}>{data.treasures}</Text>
            ) : (
              <View style={[styles.emptyLine, { minHeight: 40 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Расходники</Text>
            {data.consumables.length === 0 ? (
              <View style={[styles.emptyLine, { minHeight: 40 }]} />
            ) : (
              data.consumables.map((c, i) => (
                <Text key={i} style={styles.tableCellText}>
                  {c.name} — {c.quantity} шт.
                </Text>
              ))
            )}
          </View>

          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Магические предметы</Text>
            {data.magicItems.items.length === 0 ? (
              <View style={[styles.emptyLine, { minHeight: 40 }]} />
            ) : (
              data.magicItems.items.map((item, i) => (
                <Text key={i} style={styles.tableCellText}>
                  {i + 1}. {item}
                </Text>
              ))
            )}
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page} wrap>
        {/* Магические характеристики */}
        <View style={[styles.statStrip, { marginBottom: 8 }]}>
          <View style={styles.spellStatBox}>
            <Text style={styles.boxLabel}>Характеристика</Text>
            <Text style={styles.spellStatValue}>{data.spellcastingAbilityLabel}</Text>
          </View>
          <View style={styles.spellStatBox}>
            <Text style={styles.boxLabel}>Модификатор</Text>
            <Text style={styles.spellStatValue}>{data.spellcastingModifierLabel}</Text>
          </View>
          <View style={styles.spellStatBox}>
            <Text style={styles.boxLabel}>Сложность спасброска</Text>
            <Text style={styles.spellStatValue}>{data.spellSaveDC}</Text>
          </View>
          <View style={styles.spellStatBox}>
            <Text style={styles.boxLabel}>Бонус атаки</Text>
            <Text style={styles.spellStatValue}>{data.spellAttackBonusLabel}</Text>
          </View>
        </View>

        {/* Ячейки заклинаний */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <Text style={styles.sectionTitle}>Ячейки заклинаний</Text>
          {data.spellSlots.length === 0 ? (
            <Text style={{ fontSize: 8, color: LINE, textAlign: 'center' }}>
              Нет доступных ячеек заклинаний
            </Text>
          ) : (
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}
            >
              {data.spellSlots.map((slot, i) => (
                <View key={i} style={styles.slotBox}>
                  <Text style={styles.slotLevelLabel}>{slot.levelLabel}</Text>
                  <Text style={styles.slotValue}>
                    {slot.available}/{slot.max}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Заговоры */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <Text style={styles.sectionTitle}>Заговоры</Text>
          {data.cantrips.length === 0 ? (
            <View style={[styles.emptyLine, { minHeight: 20 }]} />
          ) : (
            <>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, styles.spellColName]}>Название</Text>
                <Text style={[styles.tableHeaderText, styles.spellColTime]}>Время</Text>
                <Text style={[styles.tableHeaderText, styles.spellColRange]}>Дистанция</Text>
                <Text style={[styles.tableHeaderText, styles.spellColTags]}>Теги / Урон</Text>
              </View>
              {data.cantrips.map((spell, i) => {
                const tags = [
                  spell.isConcentration ? 'Конц.' : '',
                  spell.isRitual ? 'Ритуал' : '',
                  spell.damageLabel,
                ]
                  .filter(Boolean)
                  .join(' · ');
                return (
                  <View key={i} style={styles.spellTableRow}>
                    <Text style={[styles.tableCellText, styles.spellColName]}>{spell.name}</Text>
                    <Text style={[styles.tableCellText, styles.spellColTime]}>
                      {spell.castingTime}
                    </Text>
                    <Text style={[styles.tableCellText, styles.spellColRange]}>{spell.range}</Text>
                    <Text style={[styles.tableCellText, styles.spellColTags]}>{tags || '—'}</Text>
                  </View>
                );
              })}
            </>
          )}
        </View>

        {/* Подготовленные заклинания */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <Text style={styles.sectionTitle}>Подготовленные заклинания</Text>
          {data.preparedSpells.length === 0 ? (
            <View style={[styles.emptyLine, { minHeight: 30 }]} />
          ) : (
            <>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, styles.spellColName]}>Название</Text>
                <Text style={[styles.tableHeaderText, styles.spellColLevel]}>Ур.</Text>
                <Text style={[styles.tableHeaderText, styles.spellColTime]}>Время</Text>
                <Text style={[styles.tableHeaderText, styles.spellColRange]}>Дистанция</Text>
                <Text style={[styles.tableHeaderText, styles.spellColTags]}>Теги / Урон</Text>
              </View>
              {data.preparedSpells
                .sort((a, b) => a.level - b.level)
                .map((spell, i) => {
                  const tags = [
                    spell.isConcentration ? 'Конц.' : '',
                    spell.isRitual ? 'Ритуал' : '',
                    spell.damageLabel,
                  ]
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <View key={i} style={styles.spellTableRow}>
                      <Text style={[styles.tableCellText, styles.spellColName]}>{spell.name}</Text>
                      <Text style={[styles.tableCellText, styles.spellColLevel]}>
                        {spell.level}
                      </Text>
                      <Text style={[styles.tableCellText, styles.spellColTime]}>
                        {spell.castingTime}
                      </Text>
                      <Text style={[styles.tableCellText, styles.spellColRange]}>
                        {spell.range}
                      </Text>
                      <Text style={[styles.tableCellText, styles.spellColTags]}>{tags || '—'}</Text>
                    </View>
                  );
                })}
            </>
          )}
        </View>

        {/* Известные заклинания */}
        {data.knownSpells.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Известные заклинания</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.spellColName]}>Название</Text>
              <Text style={[styles.tableHeaderText, styles.spellColLevel]}>Ур.</Text>
              <Text style={[styles.tableHeaderText, styles.spellColSchool]}>Школа</Text>
              <Text style={[styles.tableHeaderText, styles.spellColTime]}>Время</Text>
              <Text style={[styles.tableHeaderText, styles.spellColRange]}>Дистанция</Text>
              <Text style={[styles.tableHeaderText, styles.spellColTags]}>Теги / Урон</Text>
            </View>
            {data.knownSpells
              .sort((a, b) => a.level - b.level)
              .map((spell, i) => {
                const tags = [
                  spell.isConcentration ? 'Конц.' : '',
                  spell.isRitual ? 'Ритуал' : '',
                  spell.damageLabel,
                ]
                  .filter(Boolean)
                  .join(' · ');
                return (
                  <View key={i} style={styles.spellTableRow}>
                    <Text style={[styles.tableCellText, styles.spellColName]}>{spell.name}</Text>
                    <Text style={[styles.tableCellText, styles.spellColLevel]}>{spell.level}</Text>
                    <Text style={[styles.tableCellText, styles.spellColSchool]}>
                      {spell.school}
                    </Text>
                    <Text style={[styles.tableCellText, styles.spellColTime]}>
                      {spell.castingTime}
                    </Text>
                    <Text style={[styles.tableCellText, styles.spellColRange]}>{spell.range}</Text>
                    <Text style={[styles.tableCellText, styles.spellColTags]}>{tags || '—'}</Text>
                  </View>
                );
              })}
          </View>
        )}
      </Page>
      <Page size="A4" style={styles.page} wrap>
        <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 8 }]}>Заметки</Text>

        {/* Ряд 1: Сюжет + Персонажи (крупные) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Заметки о сюжете</Text>
            {data.notes.plotNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.plotNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Заметки о персонажах</Text>
            {data.notes.npcNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.npcNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
        </View>

        {/* Ряд 2: Локации + Задания (средние) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Локации</Text>
            {data.notes.locationNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.locationNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Задания и цели</Text>
            {data.notes.questNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.questNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
        </View>

        {/* Ряд 3: Секреты + Боевые заметки (средние) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Секреты и тайны</Text>
            {data.notes.secretNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.secretNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Боевые заметки</Text>
            {data.notes.combatNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.combatNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
        </View>

        {/* Ряд 4: Контакты + Слухи + Прочее (маленькие) */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Контакты</Text>
            {data.notes.contactNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.contactNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Слухи и легенды</Text>
            {data.notes.rumorNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.rumorNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
          <View style={[styles.section, { flex: 1, maxHeight: 180, height: 180 }]}>
            <Text style={styles.sectionTitle}>Прочее</Text>
            {data.notes.miscNotes ? (
              <Text style={styles.freeTextBlock}>{data.notes.miscNotes}</Text>
            ) : (
              <View style={[styles.emptyLine, { maxHeight: 180, height: 180 }]} />
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

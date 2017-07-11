import React from 'react';

export default () => (
  <section id="rules-page">
    <h1>Game Rules</h1>
    <section className="page-content">
      <section>
        <h4>General</h4>
        <div >
          <ul>
            <li>1.1 Players will score points based on their performances in
              Premier League matches only. Positions are defined in pre-season by
              the FF panel and listed in the Players tab.
              <ul>
                <li><strong>ALL PLAYERS</strong>
                  <ul>
                    <li>Player starts match +3 (awarded for starting the match in
                      the starting XI)
                    </li>
                    <li>Player substitute appearance +1 (awarded for making an
                      appearance having started the match on the substitute’s
                      bench)
                    </li>
                    <li>Assist +3 (assists may be awarded to more than one player.
                      Awarded to players that win penalties as long as they have
                      touched the ball before being fouled)
                    </li>
                    <li>Booked -2</li>
                    <li>Sent off -5 (includes -2 for a yellow card)</li>
                  </ul>
                </li>
                <li><strong>GOALKEEPERS (GK)</strong>
                  <ul>
                    <li>Full clean sheet +5 (awarded to players who have played
                      for 60 minutes or more in the game and includes the
                      substitute appearance point if applicable)
                    </li>
                    <li>Goal conceded -1</li>
                    <li>Penalty save +5</li>
                    <li>Goalkeeper goal scored +10</li>
                  </ul>
                </li>
                <li><strong>DEFENDERS (CB/FB)</strong>
                  <ul>
                    <li>Full clean sheet +5 (awarded to players who have played
                      for 60 minutes or more in the game and includes the
                      substitute appearance point if applicable)
                    </li>
                    <li>Goal conceded -1</li>
                    <li>Defender goal scored +8</li>
                  </ul>
                </li>
                <li><strong>MIDFIELDERS (CM/WM)</strong>
                  <ul>
                    <li>Midfielder goal scored +6</li>
                  </ul>
                </li>
                <li><strong>FORWARDS (FWD)</strong>
                  <ul>
                    <li>Striker goal scored +4</li>
                  </ul>
                </li>
                <li><strong>Please note</strong> points are based on the Sky
                  Sports Fantasy Football stats
                  (https://fantasyfootball.skysports.com/statistics/). Their
                  decision is final. Definitions in full can be found in the <a
                    href="https://fantasyfootball.skysports.com/#terms">Sky Sports
                    Fantasy Football T&amp;Cs</a></li>
              </ul>
            </li>
            <li>1.2 The final week of scoring coincides with the final round of
              Premier League fixtures. Players are NOT awarded points scored in
              the FA Cup, or any other cup competition, at any stage.
            </li>
            <li>1.3 Each manager pays an agreed fee to enter. League winners will
              receive the largest prize, while second place finishers along with
              the cup winner are also entitled to a payout.
            </li>
            <li>1.4 Should managers tie on overall points, their collective team
              score will act as goal difference to separate them.
            </li>
            <li>1.5 At the end of the season, the number of teams
              promoted/relegated depends on the total number of teams in each
              division. In leagues of six or less managers, two teams are
              relegated from the Premier League and two promoted from
              Championship, while with seven or more, three will be
              promoted/relegated.
            </li>
            <li>1.6 These rules have been agreed by a panel of original managers.
              All future adjustments are subject to vote by that same panel.
            </li>
            <li>1.7 The &#8220;player list&#8221; referred to in these rules can
              be found here &#8211; https://fantasyfootball.skysports.com/#stats
            </li>
            <li>Players not included in this list will not be eligible to score
              points.
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h4>Players</h4>
        <div >
          <ul>
            <li>2.1 All teams must include one goalkeeper, two full backs, two
              centre backs, two wide midfielders, two centre midfielders and two
              strikers, together with a player of any position in the sub spot.
            </li>
            <li>2.2 Players are assigned their position at the beginning of the
              season, and may only be swapped into another category if there is
              100% agreement within the FF panel that his position has changed.
            </li>
            <li>2.3 All teams may only include a maximum of two players from any
              given Premier League side.
            </li>
            <li>2.4 Should a player change clubs while he is owned by a manager
              (and as a result push the number of allotted players from a Premier
              League side above two) the manager may continue as normal until he
              drops a player from that given team. For e.g. Manager A owns Steven
              Gerrard and Daniel Sturridge (both Liverpool) as well as Gareth
              Barry (Man City); Liverpool sign Barry in the transfer window.
              Should Manager A choose to drop/trade any of these three at any
              future stage, he will not be allowed to replace them with another
              Liverpool player if it subsequently puts him back above the two
              player max.
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h4>Transfers</h4>
        <div >
          <ul>
            <li><strong>Definitions:</strong>
              <ul>
                <li>Transfer &#8211; to pick up an available player. Available
                  means no other manager in the same division has the player in
                  his team or has transferred him in during the current window.
                </li>
                <li>Swap &#8211; to move a player between their natural position
                  and the sub spot.
                </li>
                <li>Trade &#8211; to exchange players with another manager in your
                  division, having agreed the deal in advance.
                </li>
                <li>Waiver &#8211; to request a new player be transferred into
                  your team at the end of their waiver period.
                </li>
              </ul>
            </li>
            <li>3.1 The weekly transfer deadline is 10.59am on Saturday, except
              where there is a Friday night Premier League game, when the deadline
              for transfers is 6.59pm on the Friday evening. Any player acquired
              before that deadline will start scoring from the next Premier League
              fixture after it passes. The transfer window for the following
              scoring week re-opens immediately after the passing of the transfer
              deadline, so either 7pm Friday or 11am Saturday depending on the
              fixture list.
            </li>
            <li>3.2 There is no maximum number of trades per week.</li>
            <li>3.3 A trade deadline will be enforced two weeks (three weekends)
              prior to final fixture of the season. Transfers and swaps are not
              included in this and will be allowed until the last game of the
              season.
            </li>
            <li>3.4 The maximum number of transfers (adds/drops) by any one
              manager may not exceed two per week.
            </li>
            <li>3.5 Additional transfers will be allowed only when essential to
              facilitate a trade. Any dubious decisions will be put before the
              panel.
            </li>
            <li>3.6 The maximum number of swaps within a team, e.g. swap Andrei
              Arshavin in WM for David Bentley in Sub, is two per week.
            </li>
            <li>3.7 All transfers, swaps, waiver requests and trades must be
              posted via the transfer entry fields on the Draft Fantasy Football
              website. They are not official until this is completed. Where a
              dispute may arise over which manager transferred in the player
              first, the revision history will be checked and the manager who
              completed the entire transaction first will be deemed the owner.
              Trades must be confirmed by both managers within 24 hours of one
              another. All moves entered into the transfers page are final.
            </li>
            <li>3.8 If a new player is added to the player list after signing for
              a Premier League club from another league, a waiver system is in
              place to determine who has priority in picking him up. This will be
              based on the draft order, with lowest pick up to highest pick
              holding priority. A player will only be governed by these rules for
              a total of<strong> three days</strong> after being added to the game
              player list. When a player is added, the game scorers will announce
              this (along with his position) on the FF WhatsApp group. The time
              stamp on that WhatsApp post marks the start of the four day waiver
              period. So for example, a new player is added to the list on Monday
              and the WhatsApp post is at 4.04pm. The waiver period for the given
              player(s) ends on Friday at 4.04pm. During that waiver period any
              manager may request the player. The highest ranked manager (on the
              waiver list) who requests the player will have him added to his team
              on the day this period expires. This counts as one weekly transfer
              at the point of completion. New players that are subject waivers
              will also be added to the relevant section on the transfers page.
              Waiver picks may be included in trades but clear details must be
              included at the time of putting the trade through.
            </li>
            <li>3.9 It is the responsibility of each manager to ensure their team
              will still meet all game rules at the point of completion. Should a
              team break the game rules by completing a waiver transfer, then the
              priority will be forfeited by its manager and the player passed to
              the next manager in line who has requested the player. If no other
              manager has requested the player, he will become available as a
              normal transfer with immediate effect.
            </li>
            <li>3.10. Once a manager uses his waiver priority to acquire a player,
              he is automatically moved to the bottom of the list.
            </li>
            <li>3.11 If a player is deemed an established squad member of a
              Premier League team, as in the Gareth Barry case of ‘08/09, but has
              not been added to the player list, managers may add this player to
              their team without the need for waivers &#8211; but do so at their
              own risk. Players will not begin scoring until they do so on the
              player list.
            </li>
            <li>3.12 There is no limit on the number of transfers/trades/swaps
              between draft day and 10.59am on the first Saturday of the season.
            </li>
            <li>3.13 Any player dropped during the course of the weekly transfer
              window may not be picked up again by the same manager until the
              Monday of the following window. The only exception is during
              pre-season unlimited transfers but for clarity, any player dropped
              during this period may not be picked up by the same manager on the
              first Saturday or Sunday of the season.
            </li>
            <li>3.14 Trades/transfers are subject to review by the aforementioned
              panel and can be vetoed if deemed unfair or an act of collusion. A
              unanimous decision must be reached by all panel managers NOT
              involved in the trade in order to veto.
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h4>FF Cup</h4>
        <div >
          <ul>
            <li>4.1 Players from all leagues will be entered into a cup
              competition with a cash prize for the winner.
            </li>
            <li>4.2 The cup competition consists of up to five rounds (group
              stage, last 16, quarter-final, semi-final, final) depending on total
              number of managers in the competition. Each round will take place on
              a randomly selected week but these may be subject to change if a
              full programme of fixtures (i.e. all 20 teams playing) cannot be
              fulfilled in the originally selected week. The default change will
              be to the move cup fixtures to the following weekend.
            </li>
            <li>4.3 The first round of the cup will be a three-game group stage
              format, where all managers in the group play against each other.
              Points will be awarded according to how you perform against your
              rivals that week; so for example, a group of three will see the top
              scoring manager receive three points, the next in line score one
              point and the worst performer zero points. Groups of four will see
              the top scoring manager receive four points, second two points,
              third one point and lowest scorer awarded zero points. The top two
              finishers in each group progress, though this may change
              season-on-season depending on the number of managers and related
              format. With a full quota of 24 managers, the top two from 8 groups
              of three progress to a last 16 round.
            </li>
            <li>4.4 Subsequent rounds will all be a knockout format, with the draw
              made randomly, prior to the week&#8217;s matches. Managers will play
              head-to-head over two legs with one opponent to progress.
            </li>
            <li>4.5 Prior to each round, managers must pick four players from your
              team to score in the cup competition. These are picked by sending an
              email/text to a TBC scorer, confirming your choice for that round.
              Your selection will be a secret to all other players involved.
            </li>
            <li>4.6 Confirmation of your team must be sent by 11am on the Saturday
              of the cup weekend. If a manager fails to do this, his team will be
              automatically picked alphabetically by surname.
            </li>
            <li>4.7 Cup teams must be submitted in a rank order, 1-4.</li>
            <li>4.8 In the event that cup team scores are level when a round is
              complete, the score for the player ranked highest will act as a tie
              breaker. Should this also be equal, the players ranked second (and
              if necessary third) will be used. In the knockout rounds, the
              combined scores of the top ranked players in each leg will be used
              to divide the teams, followed by the players ranked second (and if
              necessary third). If teams still cannot be separated, a play-off
              will take place the following weekend, when managers can pick any
              four players from their team to compete. This process will continue
              until there is a winner.
            </li>
            <li>4.9 Players selected for the cup still score points as normal in
              the league format.
            </li>
            <li>4.10. Players can only be selected once across each of the three
              group games. At the knockout stages, managers may only select
              players once in each two-legged round, i.e. the last 16,
              quarter-final, semi-final. The final is a one-off game and managers
              can pick any player within their team.
            </li>
            <li>4.11 Players may be selected again during the the same round if
              they are traded or added to a new team.
            </li>
            <li>4.12 Prize money will be awarded to the cup winner only.</li>
            <li>4.13 Should a match be cancelled during a designated cup week, any
              player selected from that match will fulfil their cup duties the
              following weekend.
            </li>
            <li>4.14 Failure to pick an FF Cup team twice in one season results in
              automatic elimination from the competition.
            </li>
            <li>4.15 Teams finishing on the same number of points in the FF Cup
              group stage will be separated by their collective score over the
              three gameweeks. Should this also be a equal, a play-off will take
              place the following weekend, when managers can pick any four players
              from their team to compete. This process will continue until there
              is a winner.
            </li>
          </ul>
        </div>
      </section>
    </section>
  </section>
);

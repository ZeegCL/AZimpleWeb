import * as React from 'react';
import axios from 'axios';

interface FactionBarProps {
    id: number;
}

interface FactionBarState {
    alliance: any;
    horde: any;
    total: number;
}

export default class FactionBar extends React.Component<FactionBarProps, FactionBarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            alliance: {
                pct: 50,
                count: 0
            },
            horde: {
                pct: 50,
                count: 0
            },
            total: 0
        };
    }

    private calcBarWidth(total: number, count: number)
    {
        return (total === 0) ? 50 : (count * 100 / total);
    }

    private async getOnlineCount() {
        
        await axios.get(`/api/Server/Realm/${this.props.id}/Count`)
            .then((response) => {
                console.log("Count", response);
                let counts:any =  response.data;

                this.setState({
                    alliance: {
                        pct: this.calcBarWidth(counts.totalCount, counts.allianceCount),
                        count: counts.allianceCount
                    },
                    horde: {
                        pct: this.calcBarWidth(counts.totalCount, counts.hordeCount),
                        count: counts.hordeCount
                    },
                    total: counts.totalCount
                });
            })
            .catch((error) => {
                console.error("FactionBar.getOnlineCount()", error);
            });
    }

    componentWillMount() {
        this.getOnlineCount();
    }

    public render() {
        console.log(this.state);
        return <div>
                <span>Total players online: { this.state.total }</span>
                <div className="progress">
                        <div className="progress-bar bar-alliance" role="progressbar" style={ {width: `${this.state.alliance.pct}%`} } aria-valuenow={ this.state.alliance.count } aria-valuemin="0" aria-valuemax="100">{ this.state.alliance.count } Alliance</div>
                        <div className="progress-bar bar-horde" role="progressbar" style={ {width: `${this.state.horde.pct}%`} } aria-valuenow={ this.state.horde.count } aria-valuemin="0" aria-valuemax="100">{ this.state.horde.count } Horde</div>
                </div>
            </div>;
    }
}
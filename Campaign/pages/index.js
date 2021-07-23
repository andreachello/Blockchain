import React, { Component } from "react";
import factory from "../ethereum/factory"
import { Card, Button} from "semantic-ui-react";
import Layout from "../components/layout";
import { Link } from "../routes";



class CampaignIndex extends Component {
    // exclusively used by next for server side loading (static makes it so that it does not create an instance)
    static async getInitialProps() {
        const campaigns =  await factory.methods.getDeployedCampaigns().call();

        return { campaigns }
    }

    renderCampaigns() {
        // call a function into map and it will be called one time for each element in the array
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
         });

         return <Card.Group items={items} />
        }

    render() {
        return (
            <Layout>
                <div>
                    <h3> Open Campaigns </h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button 
                            floated="right"
                            content="Create Campaign"
                            icon="add circle"
                            primary
                            />
                        </a>
                    </Link>
                    
                    {this.renderCampaigns()}

                    </div>
            </Layout>
        )
    }


}

export default CampaignIndex;